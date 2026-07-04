import type {
  ApplicationDto,
  ApplicationStatus,
  ContractDto,
  ContractStatus,
  JobDto,
  JobStatus,
  ListServiceDto,
  PostJobDto,
  ServiceListingDto,
  ServiceListingStatus,
  SubmitApplicationDto,
} from '@/lib/api/generated/model'

export type MarketplaceApplication = ApplicationDto
export type MarketplaceContract = ContractDto
export type MarketplaceJob = JobDto
export type MarketplaceService = ServiceListingDto
export type MarketplaceApplicationStatus = ApplicationStatus
export type MarketplaceContractStatus = ContractStatus
export type MarketplaceJobStatus = JobStatus
export type MarketplaceServiceStatus = ServiceListingStatus
export type ListServiceRequest = ListServiceDto
export type PostJobRequest = PostJobDto
export type SubmitApplicationRequest = SubmitApplicationDto
