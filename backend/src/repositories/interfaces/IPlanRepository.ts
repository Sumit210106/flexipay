import { IBaseRepository } from "./IBaseRepository";
import { PlanDocument } from "../../models/plan.model";

export interface IPlanRepository extends IBaseRepository<PlanDocument> {
  findByOrganizationId(organizationId: string): Promise<PlanDocument[]>;
  findByNameAndOrg(name: string, organizationId: string): Promise<PlanDocument | null>;
}
