import { UserModel, UserDocument } from "../../models/user.model";
import { IUserRepository } from "../interfaces/IUserRepository";

export class MongoUserRepository implements IUserRepository {
  async findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id);
  }

  async create(data: Partial<UserDocument>): Promise<UserDocument> {
    return UserModel.create(data);
  }

  async update(id: string, data: Partial<UserDocument>): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return result !== null;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email });
  }

  async findByOrganizationId(organizationId: string): Promise<UserDocument[]> {
    return UserModel.find({ organizationId });
  }
}
