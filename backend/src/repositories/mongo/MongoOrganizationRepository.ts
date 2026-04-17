import { Organization, OrganizationDocument } from "../../models/organization.model";
import { IOrganizationRepository } from "../interfaces/IOrganizationRepository";

export class MongoOrganizationRepository implements IOrganizationRepository {
  async findById(id: string): Promise<OrganizationDocument | null> {
    return Organization.findById(id);
  }

  async create(data: Partial<OrganizationDocument>): Promise<OrganizationDocument> {
    return Organization.create(data);
  }

  async update(id: string, data: Partial<OrganizationDocument>): Promise<OrganizationDocument | null> {
    return Organization.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Organization.findByIdAndDelete(id);
    return result !== null;
  }

  async findByName(name: string): Promise<OrganizationDocument | null> {
    return Organization.findOne({ name });
  }
}
