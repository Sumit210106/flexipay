import { IBaseRepository } from "./IBaseRepository";
import { OrganizationDocument } from "../../models/organization.model";

export interface IOrganizationRepository extends IBaseRepository<OrganizationDocument> {
  findByName(name: string): Promise<OrganizationDocument | null>;
}
