import {createHash} from "crypto";
import {FieldValue} from "firebase-admin/firestore";
import {db} from "../../config/firebase";
import {UserModel} from "./user.model";

const USERS_COLLECTION = "users";
const EMAIL_INDEX_COLLECTION = "user_email_indexes";

class UserRepository {
  private users = db.collection(USERS_COLLECTION);
  private emailIndexes = db.collection(EMAIL_INDEX_COLLECTION);

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private getEmailHash(email: string): string {
    return createHash("sha256")
      .update(this.normalizeEmail(email))
      .digest("hex");
  }

  async findById(uid: string): Promise<UserModel | null> {
    const snapshot = await this.users.doc(uid).get();

    if (!snapshot.exists) {
      return null;
    }

    return snapshot.data() as UserModel;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const emailHash = this.getEmailHash(email);

    const indexSnapshot = await this.emailIndexes
      .doc(emailHash)
      .get();

    if (!indexSnapshot.exists) {
      return null;
    }

    const data = indexSnapshot.data();

    if (!data?.uid) {
      return null;
    }

    return this.findById(data.uid as string);
  }

  async create(user: UserModel): Promise<void> {
    const uid = user.uid;
    const emailHash = this.getEmailHash(user.email);

    const userRef = this.users.doc(uid);
    const emailRef = this.emailIndexes.doc(emailHash);

    await db.runTransaction(async (transaction) => {
      const userSnapshot = await transaction.get(userRef);
      const emailSnapshot = await transaction.get(emailRef);

      if (userSnapshot.exists) {
        throw new Error("USER_ALREADY_EXISTS");
      }

      if (emailSnapshot.exists) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }

      transaction.create(userRef, {
        ...user,
        email: this.normalizeEmail(user.email),
      });

      transaction.create(emailRef, {
        uid,
        createdAt: FieldValue.serverTimestamp(),
      });
    });
  }

  async update(
    uid: string,
    data: Partial<UserModel>
  ): Promise<void> {
    const userRef = this.users.doc(uid);

    await db.runTransaction(async (transaction) => {
      const userSnapshot = await transaction.get(userRef);

      if (!userSnapshot.exists) {
        throw new Error("USER_NOT_FOUND");
      }

      const currentUser = userSnapshot.data() as UserModel;

      if (data.email && data.email !== currentUser.email) {
        throw new Error("EMAIL_UPDATE_NOT_SUPPORTED");
      }

      transaction.update(userRef, {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
  }

  async delete(uid: string): Promise<void> {
    const userRef = this.users.doc(uid);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      return;
    }

    const user = userSnapshot.data() as UserModel;
    const emailHash = this.getEmailHash(user.email);

    const emailRef = this.emailIndexes.doc(emailHash);

    await db.runTransaction(async (transaction) => {
      const currentUser = await transaction.get(userRef);
      const currentEmail = await transaction.get(emailRef);

      if (!currentUser.exists) {
        return;
      }

      transaction.delete(userRef);

      if (currentEmail.exists && currentEmail.data()?.uid === uid) {
        transaction.delete(emailRef);
      }
    });
  }
}

export const userRepository = new UserRepository();
