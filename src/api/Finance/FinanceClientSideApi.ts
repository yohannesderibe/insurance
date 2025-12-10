// // src/api/Finance/financeOfficerApi.ts
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5150/api/Finance';

// export interface MotorApplication {
//   id: string;
//   clientId: string;
//   customerName: string;
//   model: string;
//   subCategoryName: string;
//   yearOfManufacture: number;
//   marketPrice: number;
//   status: 'Pending' | 'Approved' | 'Rejected' | 'Edited' | 'AwaitingPayment';
//   registrationNumber?: string;
//   engineNumber?: string;
//   chassisNumber?: string;
//   calculatedPremium: number;
//   createdAt: string;
//   categoryName: string;
//   message?: string;
// }

// export interface RejectionRequest {
//   message: string;
// }

// // Helper: reshape backend into frontend form
// const mapApp = (app: any, source: string): MotorApplication => {
//   console.log(`🔧 Mapping ${source} application - RAW DATA:`, app);
  
//   const mappedApp = {
//     id: app.applicationId, // This should come from applicationId
//     clientId: app.clientId,
//     customerName: `Client ${app.clientId?.substring(0, 8)}` || "Unknown Client",
//     model: app.model,
//     subCategoryName: app.subCategoryName,
//     yearOfManufacture: app.yearOfManufacture,
//     marketPrice: app.marketPrice,
//     status: app.status,
//     registrationNumber: app.registrationNumber,
//     engineNumber: app.engineNumber,
//     chassisNumber: app.chassisNumber,
//     calculatedPremium: app.calculatedPremium,
//     createdAt: app.createdAt,
//     categoryName: app.categoryName,
//     message: app.message
//   };
  
//   console.log(`🔧 Mapping ${source} application - MAPPED RESULT:`, mappedApp);
//   return mappedApp;
// };

// // Get all pending motor applications
// export const getPendingApplications = async (): Promise<MotorApplication[]> => {
//   try {
//     console.log('🟡🔍 Making API call to: /motor/pending');
//     const response = await axios.get(`${API_BASE_URL}/motor/pending`);
//     console.log('🟡✅ PENDING API Response - Status:', response.status, 'Data:', response.data);
    
//     if (!Array.isArray(response.data)) {
//       console.warn('🟡⚠️ PENDING: Response data is not an array:', response.data);
//       return [];
//     }
    
//     const mapped = response.data.map((app: any) => mapApp(app, 'PENDING'));
//     console.log('🟡📋 Final PENDING applications count:', mapped.length);
//     return mapped;
//   } catch (error: any) {
//     console.error('🟡❌ Error fetching pending applications:', error.response?.data || error.message);
//     return [];
//   }
// };

// // Get all approved motor applications
// export const getApprovedApplications = async (): Promise<MotorApplication[]> => {
//   try {
//     console.log('🟢🔍 Making API call to: /motor/approved');
//     const response = await axios.get(`${API_BASE_URL}/motor/approved`);
//     console.log('🟢✅ APPROVED API Response - Status:', response.status, 'Data:', response.data);
    
//     if (!Array.isArray(response.data)) {
//       console.warn('🟢⚠️ APPROVED: Response data is not an array:', response.data);
//       return [];
//     }
    
//     const mapped = response.data.map((app: any) => mapApp(app, 'APPROVED'));
//     console.log('🟢📋 Final APPROVED applications count:', mapped.length);
//     return mapped;
//   } catch (error: any) {
//     console.error('🟢❌ Error fetching approved applications:', error.response?.data || error.message);
//     return [];
//   }
// };

// // Get all rejected motor applications
// export const getRejectedApplications = async (): Promise<MotorApplication[]> => {
//   try {
//     console.log('🔴🔍 Making API call to: /motor/rejected');
//     const response = await axios.get(`${API_BASE_URL}/motor/rejected`);
//     console.log('🔴✅ REJECTED API Response - Status:', response.status, 'Data:', response.data);
    
//     if (!Array.isArray(response.data)) {
//       console.warn('🔴⚠️ REJECTED: Response data is not an array:', response.data);
//       return [];
//     }
    
//     const mapped = response.data.map((app: any) => mapApp(app, 'REJECTED'));
//     console.log('🔴📋 Final REJECTED applications count:', mapped.length);
//     return mapped;
//   } catch (error: any) {
//     console.error('🔴❌ Error fetching rejected applications:', error.response?.data || error.message);
//     return [];
//   }
// };

// // Get ALL applications from all endpoints
// export const getAllApplications = async (): Promise<MotorApplication[]> => {
//   try {
//     console.log('🔄🚀 STARTING COMPLETE DATA FETCH FROM ALL ENDPOINTS');
    
//     const [pending, approved, rejected] = await Promise.allSettled([
//       getPendingApplications(),
//       getApprovedApplications(),
//       getRejectedApplications()
//     ]);

//     console.log('📊🎯 ALL ENDPOINT RESULTS:');
//     console.log('   PENDING:', pending.status === 'fulfilled' ? pending.value : pending.reason);
//     console.log('   APPROVED:', approved.status === 'fulfilled' ? approved.value : approved.reason);
//     console.log('   REJECTED:', rejected.status === 'fulfilled' ? rejected.value : rejected.reason);

//     const allApplications = [
//       ...(pending.status === 'fulfilled' ? pending.value : []),
//       ...(approved.status === 'fulfilled' ? approved.value : []),
//       ...(rejected.status === 'fulfilled' ? rejected.value : [])
//     ];

//     console.log('📊📈 FINAL COMBINED DATA:');
//     console.log('   Total applications:', allApplications.length);
    
//     // Group by status for better visibility
//     const byStatus = allApplications.reduce((acc, app) => {
//       const status = app.status || 'Unknown';
//       if (!acc[status]) acc[status] = [];
//       acc[status].push(app);
//       return acc;
//     }, {} as Record<string, MotorApplication[]>);
    
//     Object.entries(byStatus).forEach(([status, apps]) => {
//       console.log(`   ${status}: ${apps.length} applications`);
//       apps.forEach((app, index) => {
//         console.log(`     ${index + 1}. ID: ${app.id}, Model: ${app.model}`);
//       });
//     });
    
//     return allApplications;
//   } catch (error) {
//     console.error('❌💥 CRITICAL ERROR in getAllApplications:', error);
//     return [];
//   }
// };

// // Approve a motor application
// export const approveApplication = async (id: string): Promise<void> => {
//   console.log(`✅ Approving application: ${id}`);
//   if (!id) {
//     throw new Error('Application ID is required for approval');
//   }
//   try {
//     const response = await axios.post(`${API_BASE_URL}/motor/${id}/approve`);
//     console.log(`✅ Approve API success for: ${id}`, response.status);
//   } catch (error: any) {
//     console.error(`❌ Approve API error for ${id}:`, error);
//     throw error;
//   }
// };

// // Reject a motor application
// export const rejectApplication = async (id: string, rejectionReason: string): Promise<void> => {
//   console.log(`❌ Rejecting application: ${id} with reason: ${rejectionReason}`);
//   if (!id) {
//     throw new Error('Application ID is required for rejection');
//   }
//   const rejectionRequest: RejectionRequest = { message: rejectionReason };
//   try {
//     const response = await axios.post(`${API_BASE_URL}/motor/${id}/reject`, rejectionRequest);
//     console.log(`❌ Reject API success for: ${id}`, response.status);
//   } catch (error: any) {
//     console.error(`❌ Reject API error for ${id}:`, error);
//     throw error;
//   }
// };

// // Update application status
// export const updateApplicationStatus = async (
//   id: string,
//   status: 'Approved' | 'Rejected',
//   rejectionReason?: string
// ): Promise<void> => {
//   console.log(`🔄 Updating application ${id} to status: ${status}`);
  
//   if (!id) {
//     throw new Error('Application ID is required');
//   }
  
//   if (status === 'Approved') {
//     await approveApplication(id);
//   } else if (status === 'Rejected') {
//     if (!rejectionReason) {
//       throw new Error('Rejection reason is required');
//     }
//     await rejectApplication(id, rejectionReason);
//   }
  
//   console.log(`✅ Status update completed for: ${id}`);
// };

// // Main function to get applications
// export const getApplications = async (): Promise<MotorApplication[]> => {
//   return await getAllApplications();
// };

// src/api/Finance/financeOfficerApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5150/api/Finance';

// ==================== COMMON INTERFACES ====================
export interface RejectionRequest {
  message: string;
}

// ==================== MOTOR INSURANCE INTERFACES ====================
export interface MotorApplication {
  id: string;
  clientId: string;
  customerName: string;
  model: string;
  subCategoryName: string;
  yearOfManufacture: number;
  marketPrice: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Edited' | 'AwaitingPayment';
  registrationNumber?: string;
  engineNumber?: string;
  chassisNumber?: string;
  calculatedPremium: number;
  createdAt: string;
  categoryName: string;
  message?: string;
}

// ==================== LIFE INSURANCE INTERFACES ====================
export interface LifeApplication {
  id: string;
  clientId: string;
  categoryName: string;
  subCategoryName: string;
  age: number;
  height: number;
  weight: number;
  lifePrice: number;
  lifeInsuranceType: string;
  status: string;
  createdAt: string;
  message?: string | null;
  clientFullName?: string | null;
  clientEmail?: string | null;
  clientPhoneNumber?: string | null;
  clientGender?: number;
  clientDateOfBirth?: string;
  clientNationalIdOrPassport?: string | null;
  clientPassportOrNationalIdImageUrl?: string | null;
}

// ==================== COMBINED APPLICATION TYPE ====================
export type InsuranceApplication = (MotorApplication | LifeApplication) & {
  insuranceType: 'motor' | 'life';
};

// ==================== HELPER FUNCTIONS ====================
// Map motor application
const mapMotorApp = (app: any, source: string): MotorApplication => {
  console.log(`🔧 Mapping ${source} motor application - RAW DATA:`, app);
  
  const mappedApp: MotorApplication = {
    id: app.applicationId || app.id,
    clientId: app.clientId,
    customerName: `Client ${app.clientId?.substring(0, 8)}` || "Unknown Client",
    model: app.model,
    subCategoryName: app.subCategoryName,
    yearOfManufacture: app.yearOfManufacture,
    marketPrice: app.marketPrice,
    status: app.status,
    registrationNumber: app.registrationNumber,
    engineNumber: app.engineNumber,
    chassisNumber: app.chassisNumber,
    calculatedPremium: app.calculatedPremium,
    createdAt: app.createdAt,
    categoryName: app.categoryName,
    message: app.message
  };
  
  console.log(`🔧 Mapping ${source} motor application - MAPPED RESULT:`, mappedApp);
  return mappedApp;
};

// Map life application
const mapLifeApp = (app: any, source: string): LifeApplication => {
  console.log(`❤️ Mapping ${source} life application - RAW DATA:`, app);
  
  const mappedApp: LifeApplication = {
    id: app.applicationId,
    clientId: app.clientId,
    categoryName: app.categoryName,
    subCategoryName: app.subCategoryName,
    age: app.age,
    height: app.height,
    weight: app.weight,
    lifePrice: app.lifePrice,
    lifeInsuranceType: app.lifeInsuranceType,
    status: app.status,
    createdAt: app.createdAt,
    message: app.message,
    clientFullName: app.clientFullName,
    clientEmail: app.clientEmail,
    clientPhoneNumber: app.clientPhoneNumber,
    clientGender: app.clientGender,
    clientDateOfBirth: app.clientDateOfBirth,
    clientNationalIdOrPassport: app.clientNationalIdOrPassport,
    clientPassportOrNationalIdImageUrl: app.clientPassportOrNationalIdImageUrl
  };
  
  console.log(`❤️ Mapping ${source} life application - MAPPED RESULT:`, mappedApp);
  return mappedApp;
};

// ==================== MOTOR INSURANCE API FUNCTIONS ====================
// Get all pending motor applications
export const getPendingMotorApplications = async (): Promise<MotorApplication[]> => {
  try {
    console.log('🟡🔍 Making API call to: /motor/pending');
    const response = await axios.get(`${API_BASE_URL}/motor/pending`);
    console.log('🟡✅ PENDING motor API Response - Status:', response.status, 'Data:', response.data);
    
    if (!Array.isArray(response.data)) {
      console.warn('🟡⚠️ PENDING motor: Response data is not an array:', response.data);
      return [];
    }
    
    const mapped = response.data.map((app: any) => mapMotorApp(app, 'PENDING motor'));
    console.log('🟡📋 Final PENDING motor applications count:', mapped.length);
    return mapped;
  } catch (error: any) {
    console.error('🟡❌ Error fetching pending motor applications:', error.response?.data || error.message);
    return [];
  }
};

// Get all approved motor applications
export const getApprovedMotorApplications = async (): Promise<MotorApplication[]> => {
  try {
    console.log('🟢🔍 Making API call to: /motor/approved');
    const response = await axios.get(`${API_BASE_URL}/motor/approved`);
    console.log('🟢✅ APPROVED motor API Response - Status:', response.status, 'Data:', response.data);
    
    if (!Array.isArray(response.data)) {
      console.warn('🟢⚠️ APPROVED motor: Response data is not an array:', response.data);
      return [];
    }
    
    const mapped = response.data.map((app: any) => mapMotorApp(app, 'APPROVED motor'));
    console.log('🟢📋 Final APPROVED motor applications count:', mapped.length);
    return mapped;
  } catch (error: any) {
    console.error('🟢❌ Error fetching approved motor applications:', error.response?.data || error.message);
    return [];
  }
};

// Get all rejected motor applications
export const getRejectedMotorApplications = async (): Promise<MotorApplication[]> => {
  try {
    console.log('🔴🔍 Making API call to: /motor/rejected');
    const response = await axios.get(`${API_BASE_URL}/motor/rejected`);
    console.log('🔴✅ REJECTED motor API Response - Status:', response.status, 'Data:', response.data);
    
    if (!Array.isArray(response.data)) {
      console.warn('🔴⚠️ REJECTED motor: Response data is not an array:', response.data);
      return [];
    }
    
    const mapped = response.data.map((app: any) => mapMotorApp(app, 'REJECTED motor'));
    console.log('🔴📋 Final REJECTED motor applications count:', mapped.length);
    return mapped;
  } catch (error: any) {
    console.error('🔴❌ Error fetching rejected motor applications:', error.response?.data || error.message);
    return [];
  }
};

// Get ALL motor applications from all endpoints
export const getAllMotorApplications = async (): Promise<MotorApplication[]> => {
  try {
    console.log('🚗🔄 STARTING COMPLETE MOTOR DATA FETCH FROM ALL ENDPOINTS');
    
    const [pending, approved, rejected] = await Promise.allSettled([
      getPendingMotorApplications(),
      getApprovedMotorApplications(),
      getRejectedMotorApplications()
    ]);

    console.log('🚗📊 ALL MOTOR ENDPOINT RESULTS:');
    console.log('   PENDING:', pending.status === 'fulfilled' ? pending.value.length : pending.reason);
    console.log('   APPROVED:', approved.status === 'fulfilled' ? approved.value.length : approved.reason);
    console.log('   REJECTED:', rejected.status === 'fulfilled' ? rejected.value.length : rejected.reason);

    const allApplications = [
      ...(pending.status === 'fulfilled' ? pending.value : []),
      ...(approved.status === 'fulfilled' ? approved.value : []),
      ...(rejected.status === 'fulfilled' ? rejected.value : [])
    ];

    console.log('🚗📈 FINAL COMBINED MOTOR DATA:');
    console.log('   Total motor applications:', allApplications.length);
    
    return allApplications;
  } catch (error) {
    console.error('🚗❌💥 CRITICAL ERROR in getAllMotorApplications:', error);
    return [];
  }
};

// Approve a motor application
export const approveMotorApplication = async (id: string): Promise<void> => {
  console.log(`🚗✅ Approving motor application: ${id}`);
  if (!id) {
    throw new Error('Application ID is required for approval');
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/motor/${id}/approve`);
    console.log(`🚗✅ Approve API success for: ${id}`, response.status);
  } catch (error: any) {
    console.error(`🚗❌ Approve API error for ${id}:`, error);
    throw error;
  }
};

// Reject a motor application
export const rejectMotorApplication = async (id: string, rejectionReason: string): Promise<void> => {
  console.log(`🚗❌ Rejecting motor application: ${id} with reason: ${rejectionReason}`);
  if (!id) {
    throw new Error('Application ID is required for rejection');
  }
  const rejectionRequest: RejectionRequest = { message: rejectionReason };
  try {
    const response = await axios.post(`${API_BASE_URL}/motor/${id}/reject`, rejectionRequest);
    console.log(`🚗❌ Reject API success for: ${id}`, response.status);
  } catch (error: any) {
    console.error(`🚗❌ Reject API error for ${id}:`, error);
    throw error;
  }
};

// Update motor application status
export const updateMotorApplicationStatus = async (
  id: string,
  status: 'Approved' | 'Rejected',
  rejectionReason?: string
): Promise<void> => {
  console.log(`🚗🔄 Updating motor application ${id} to status: ${status}`);
  
  if (!id) {
    throw new Error('Application ID is required');
  }
  
  if (status === 'Approved') {
    await approveMotorApplication(id);
  } else if (status === 'Rejected') {
    if (!rejectionReason) {
      throw new Error('Rejection reason is required');
    }
    await rejectMotorApplication(id, rejectionReason);
  }
  
  console.log(`🚗✅ Status update completed for: ${id}`);
};

// ==================== LIFE INSURANCE API FUNCTIONS ====================
// Get all pending life applications
export const getPendingLifeApplications = async (): Promise<LifeApplication[]> => {
  try {
    console.log('❤️🔍 Making API call to: /life/pending');
    const response = await axios.get(`${API_BASE_URL}/life/pending`);
    console.log('❤️✅ PENDING life API Response - Status:', response.status, 'Data:', response.data);
    
    if (!Array.isArray(response.data)) {
      console.warn('❤️⚠️ PENDING life: Response data is not an array:', response.data);
      return [];
    }
    
    const mapped = response.data.map((app: any) => mapLifeApp(app, 'PENDING life'));
    console.log('❤️📋 Final PENDING life applications count:', mapped.length);
    return mapped;
  } catch (error: any) {
    console.error('❤️❌ Error fetching pending life applications:', error.response?.data || error.message);
    return [];
  }
};

// Get all approved life applications
export const getApprovedLifeApplications = async (): Promise<LifeApplication[]> => {
  try {
    console.log('❤️🟢🔍 Making API call to: /life/approved');
    const response = await axios.get(`${API_BASE_URL}/life/approved`);
    console.log('❤️🟢✅ APPROVED life API Response - Status:', response.status, 'Data:', response.data);
    
    if (!Array.isArray(response.data)) {
      console.warn('❤️🟢⚠️ APPROVED life: Response data is not an array:', response.data);
      return [];
    }
    
    const mapped = response.data.map((app: any) => mapLifeApp(app, 'APPROVED life'));
    console.log('❤️🟢📋 Final APPROVED life applications count:', mapped.length);
    return mapped;
  } catch (error: any) {
    console.error('❤️🟢❌ Error fetching approved life applications:', error.response?.data || error.message);
    return [];
  }
};

// Get all rejected life applications
export const getRejectedLifeApplications = async (): Promise<LifeApplication[]> => {
  try {
    console.log('❤️🔴🔍 Making API call to: /life/rejected');
    const response = await axios.get(`${API_BASE_URL}/life/rejected`);
    console.log('❤️🔴✅ REJECTED life API Response - Status:', response.status, 'Data:', response.data);
    
    if (!Array.isArray(response.data)) {
      console.warn('❤️🔴⚠️ REJECTED life: Response data is not an array:', response.data);
      return [];
    }
    
    const mapped = response.data.map((app: any) => mapLifeApp(app, 'REJECTED life'));
    console.log('❤️🔴📋 Final REJECTED life applications count:', mapped.length);
    return mapped;
  } catch (error: any) {
    console.error('❤️🔴❌ Error fetching rejected life applications:', error.response?.data || error.message);
    return [];
  }
};

// Get ALL life applications from all endpoints
export const getAllLifeApplications = async (): Promise<LifeApplication[]> => {
  try {
    console.log('❤️🔄 STARTING COMPLETE LIFE DATA FETCH FROM ALL ENDPOINTS');
    
    const [pending, approved, rejected] = await Promise.allSettled([
      getPendingLifeApplications(),
      getApprovedLifeApplications(),
      getRejectedLifeApplications()
    ]);

    console.log('❤️📊 ALL LIFE ENDPOINT RESULTS:');
    console.log('   PENDING:', pending.status === 'fulfilled' ? pending.value.length : pending.reason);
    console.log('   APPROVED:', approved.status === 'fulfilled' ? approved.value.length : approved.reason);
    console.log('   REJECTED:', rejected.status === 'fulfilled' ? rejected.value.length : rejected.reason);

    const allApplications = [
      ...(pending.status === 'fulfilled' ? pending.value : []),
      ...(approved.status === 'fulfilled' ? approved.value : []),
      ...(rejected.status === 'fulfilled' ? rejected.value : [])
    ];

    console.log('❤️📈 FINAL COMBINED LIFE DATA:');
    console.log('   Total life applications:', allApplications.length);
    
    return allApplications;
  } catch (error) {
    console.error('❤️❌💥 CRITICAL ERROR in getAllLifeApplications:', error);
    return [];
  }
};

// Approve a life application
export const approveLifeApplication = async (id: string): Promise<void> => {
  console.log(`❤️✅ Approving life application: ${id}`);
  if (!id) {
    throw new Error('Application ID is required for approval');
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/life/${id}/approve`);
    console.log(`❤️✅ Approve API success for: ${id}`, response.data);
  } catch (error: any) {
    console.error(`❤️❌ Approve API error for ${id}:`, error);
    throw error;
  }
};

// Reject a life application
export const rejectLifeApplication = async (id: string, rejectionReason: string): Promise<void> => {
  console.log(`❤️❌ Rejecting life application: ${id} with reason: ${rejectionReason}`);
  if (!id) {
    throw new Error('Application ID is required for rejection');
  }
  const rejectionRequest: RejectionRequest = { message: rejectionReason };
  try {
    const response = await axios.post(`${API_BASE_URL}/life/${id}/reject`, rejectionRequest);
    console.log(`❤️❌ Reject API success for: ${id}`, response.data);
  } catch (error: any) {
    console.error(`❤️❌ Reject API error for ${id}:`, error);
    throw error;
  }
};

// Update life application status
export const updateLifeApplicationStatus = async (
  id: string,
  status: 'Approved' | 'Rejected',
  rejectionReason?: string
): Promise<void> => {
  console.log(`❤️🔄 Updating life application ${id} to status: ${status}`);
  
  if (!id) {
    throw new Error('Application ID is required');
  }
  
  if (status === 'Approved') {
    await approveLifeApplication(id);
  } else if (status === 'Rejected') {
    if (!rejectionReason) {
      throw new Error('Rejection reason is required');
    }
    await rejectLifeApplication(id, rejectionReason);
  }
  
  console.log(`❤️✅ Status update completed for: ${id}`);
};

// ==================== COMBINED API FUNCTIONS ====================
// Get ALL applications (both motor and life)
export const getAllApplications = async (): Promise<InsuranceApplication[]> => {
  try {
    console.log('🎯🔄 STARTING COMPLETE DATA FETCH (BOTH MOTOR AND LIFE)');
    
    const [motorApps, lifeApps] = await Promise.allSettled([
      getAllMotorApplications(),
      getAllLifeApplications()
    ]);

    console.log('🎯📊 ALL COMBINED ENDPOINT RESULTS:');
    console.log('   MOTOR:', motorApps.status === 'fulfilled' ? motorApps.value.length : motorApps.reason);
    console.log('   LIFE:', lifeApps.status === 'fulfilled' ? lifeApps.value.length : lifeApps.reason);

    const combinedApplications: InsuranceApplication[] = [
      ...(motorApps.status === 'fulfilled' 
        ? motorApps.value.map(app => ({ ...app, insuranceType: 'motor' as const })) 
        : []),
      ...(lifeApps.status === 'fulfilled' 
        ? lifeApps.value.map(app => ({ ...app, insuranceType: 'life' as const })) 
        : [])
    ];

    console.log('🎯📈 FINAL COMBINED DATA:');
    console.log('   Total applications:', combinedApplications.length);
    console.log('   Motor applications:', combinedApplications.filter(app => app.insuranceType === 'motor').length);
    console.log('   Life applications:', combinedApplications.filter(app => app.insuranceType === 'life').length);
    
    return combinedApplications;
  } catch (error) {
    console.error('🎯❌💥 CRITICAL ERROR in getAllApplications:', error);
    return [];
  }
};

// Get applications by status and type
export const getApplicationsByTypeAndStatus = async (
  insuranceType: 'motor' | 'life' | 'all',
  status: 'pending' | 'approved' | 'rejected' | 'all'
): Promise<InsuranceApplication[]> => {
  try {
    console.log(`🔍 Fetching applications: Type=${insuranceType}, Status=${status}`);
    
    let applications: InsuranceApplication[] = [];
    
    if (insuranceType === 'all' || insuranceType === 'motor') {
      let motorApps: MotorApplication[] = [];
      
      if (status === 'all' || status === 'pending') {
        motorApps = [...motorApps, ...await getPendingMotorApplications()];
      }
      if (status === 'all' || status === 'approved') {
        motorApps = [...motorApps, ...await getApprovedMotorApplications()];
      }
      if (status === 'all' || status === 'rejected') {
        motorApps = [...motorApps, ...await getRejectedMotorApplications()];
      }
      
      applications = [...applications, ...motorApps.map(app => ({ ...app, insuranceType: 'motor' as const }))];
    }
    
    if (insuranceType === 'all' || insuranceType === 'life') {
      let lifeApps: LifeApplication[] = [];
      
      if (status === 'all' || status === 'pending') {
        lifeApps = [...lifeApps, ...await getPendingLifeApplications()];
      }
      if (status === 'all' || status === 'approved') {
        lifeApps = [...lifeApps, ...await getApprovedLifeApplications()];
      }
      if (status === 'all' || status === 'rejected') {
        lifeApps = [...lifeApps, ...await getRejectedLifeApplications()];
      }
      
      applications = [...applications, ...lifeApps.map(app => ({ ...app, insuranceType: 'life' as const }))];
    }
    
    console.log(`🔍 Found ${applications.length} applications for Type=${insuranceType}, Status=${status}`);
    return applications;
  } catch (error) {
    console.error('🔍❌ Error in getApplicationsByTypeAndStatus:', error);
    return [];
  }
};

// Update application status (works for both motor and life)
export const updateApplicationStatus = async (
  id: string,
  insuranceType: 'motor' | 'life',
  status: 'Approved' | 'Rejected',
  rejectionReason?: string
): Promise<void> => {
  console.log(`🔄 Updating ${insuranceType} application ${id} to status: ${status}`);
  
  if (insuranceType === 'motor') {
    await updateMotorApplicationStatus(id, status, rejectionReason);
  } else if (insuranceType === 'life') {
    await updateLifeApplicationStatus(id, status, rejectionReason);
  } else {
    throw new Error(`Unknown insurance type: ${insuranceType}`);
  }
  
  console.log(`✅ ${insuranceType} application ${id} status update completed`);
};

// Main function to get all applications (backward compatibility)
export const getApplications = async (): Promise<InsuranceApplication[]> => {
  return await getAllApplications();
};