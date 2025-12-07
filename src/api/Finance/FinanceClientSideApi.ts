// src/api/Finance/financeOfficerApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5150/api/Finance';

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

export interface RejectionRequest {
  message: string;
}

// Helper: reshape backend into frontend form
const mapApp = (app: any, source: string): MotorApplication => {
  console.log(`🔧 Mapping ${source} application - RAW DATA:`, app);
  
  const mappedApp = {
    id: app.applicationId, // This should come from applicationId
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
  
  console.log(`🔧 Mapping ${source} application - MAPPED RESULT:`, mappedApp);
  return mappedApp;
};

// Get all pending motor applications
export const getPendingApplications = async (): Promise<MotorApplication[]> => {
  try {
    console.log('🟡🔍 Making API call to: /motor/pending');
    const response = await axios.get(`${API_BASE_URL}/motor/pending`);
    console.log('🟡✅ PENDING API Response - Status:', response.status, 'Data:', response.data);
    
    if (!Array.isArray(response.data)) {
      console.warn('🟡⚠️ PENDING: Response data is not an array:', response.data);
      return [];
    }
    
    const mapped = response.data.map((app: any) => mapApp(app, 'PENDING'));
    console.log('🟡📋 Final PENDING applications count:', mapped.length);
    return mapped;
  } catch (error: any) {
    console.error('🟡❌ Error fetching pending applications:', error.response?.data || error.message);
    return [];
  }
};

// Get all approved motor applications
export const getApprovedApplications = async (): Promise<MotorApplication[]> => {
  try {
    console.log('🟢🔍 Making API call to: /motor/approved');
    const response = await axios.get(`${API_BASE_URL}/motor/approved`);
    console.log('🟢✅ APPROVED API Response - Status:', response.status, 'Data:', response.data);
    
    if (!Array.isArray(response.data)) {
      console.warn('🟢⚠️ APPROVED: Response data is not an array:', response.data);
      return [];
    }
    
    const mapped = response.data.map((app: any) => mapApp(app, 'APPROVED'));
    console.log('🟢📋 Final APPROVED applications count:', mapped.length);
    return mapped;
  } catch (error: any) {
    console.error('🟢❌ Error fetching approved applications:', error.response?.data || error.message);
    return [];
  }
};

// Get all rejected motor applications
export const getRejectedApplications = async (): Promise<MotorApplication[]> => {
  try {
    console.log('🔴🔍 Making API call to: /motor/rejected');
    const response = await axios.get(`${API_BASE_URL}/motor/rejected`);
    console.log('🔴✅ REJECTED API Response - Status:', response.status, 'Data:', response.data);
    
    if (!Array.isArray(response.data)) {
      console.warn('🔴⚠️ REJECTED: Response data is not an array:', response.data);
      return [];
    }
    
    const mapped = response.data.map((app: any) => mapApp(app, 'REJECTED'));
    console.log('🔴📋 Final REJECTED applications count:', mapped.length);
    return mapped;
  } catch (error: any) {
    console.error('🔴❌ Error fetching rejected applications:', error.response?.data || error.message);
    return [];
  }
};

// Get ALL applications from all endpoints
export const getAllApplications = async (): Promise<MotorApplication[]> => {
  try {
    console.log('🔄🚀 STARTING COMPLETE DATA FETCH FROM ALL ENDPOINTS');
    
    const [pending, approved, rejected] = await Promise.allSettled([
      getPendingApplications(),
      getApprovedApplications(),
      getRejectedApplications()
    ]);

    console.log('📊🎯 ALL ENDPOINT RESULTS:');
    console.log('   PENDING:', pending.status === 'fulfilled' ? pending.value : pending.reason);
    console.log('   APPROVED:', approved.status === 'fulfilled' ? approved.value : approved.reason);
    console.log('   REJECTED:', rejected.status === 'fulfilled' ? rejected.value : rejected.reason);

    const allApplications = [
      ...(pending.status === 'fulfilled' ? pending.value : []),
      ...(approved.status === 'fulfilled' ? approved.value : []),
      ...(rejected.status === 'fulfilled' ? rejected.value : [])
    ];

    console.log('📊📈 FINAL COMBINED DATA:');
    console.log('   Total applications:', allApplications.length);
    
    // Group by status for better visibility
    const byStatus = allApplications.reduce((acc, app) => {
      const status = app.status || 'Unknown';
      if (!acc[status]) acc[status] = [];
      acc[status].push(app);
      return acc;
    }, {} as Record<string, MotorApplication[]>);
    
    Object.entries(byStatus).forEach(([status, apps]) => {
      console.log(`   ${status}: ${apps.length} applications`);
      apps.forEach((app, index) => {
        console.log(`     ${index + 1}. ID: ${app.id}, Model: ${app.model}`);
      });
    });
    
    return allApplications;
  } catch (error) {
    console.error('❌💥 CRITICAL ERROR in getAllApplications:', error);
    return [];
  }
};

// Approve a motor application
export const approveApplication = async (id: string): Promise<void> => {
  console.log(`✅ Approving application: ${id}`);
  if (!id) {
    throw new Error('Application ID is required for approval');
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/motor/${id}/approve`);
    console.log(`✅ Approve API success for: ${id}`, response.status);
  } catch (error: any) {
    console.error(`❌ Approve API error for ${id}:`, error);
    throw error;
  }
};

// Reject a motor application
export const rejectApplication = async (id: string, rejectionReason: string): Promise<void> => {
  console.log(`❌ Rejecting application: ${id} with reason: ${rejectionReason}`);
  if (!id) {
    throw new Error('Application ID is required for rejection');
  }
  const rejectionRequest: RejectionRequest = { message: rejectionReason };
  try {
    const response = await axios.post(`${API_BASE_URL}/motor/${id}/reject`, rejectionRequest);
    console.log(`❌ Reject API success for: ${id}`, response.status);
  } catch (error: any) {
    console.error(`❌ Reject API error for ${id}:`, error);
    throw error;
  }
};

// Update application status
export const updateApplicationStatus = async (
  id: string,
  status: 'Approved' | 'Rejected',
  rejectionReason?: string
): Promise<void> => {
  console.log(`🔄 Updating application ${id} to status: ${status}`);
  
  if (!id) {
    throw new Error('Application ID is required');
  }
  
  if (status === 'Approved') {
    await approveApplication(id);
  } else if (status === 'Rejected') {
    if (!rejectionReason) {
      throw new Error('Rejection reason is required');
    }
    await rejectApplication(id, rejectionReason);
  }
  
  console.log(`✅ Status update completed for: ${id}`);
};

// Main function to get applications
export const getApplications = async (): Promise<MotorApplication[]> => {
  return await getAllApplications();
};