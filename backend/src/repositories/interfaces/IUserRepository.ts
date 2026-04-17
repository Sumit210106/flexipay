import { IBaseRepository } from "./IBaseRepository";
import { UserDocument } from "../../models/user.model";

export interface IUserRepository extends IBaseRepository<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
  findByOrganizationId(organizationId: string): Promise<UserDocument[]>;
}
