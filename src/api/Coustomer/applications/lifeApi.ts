// // src/services/lifeApi.ts
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5150/api';

// export interface LifePreviewRequest {
//   CategoryId: string;
//   SubCategoryId: string;
//   Age: number;
//   Height: number;
//   Weight: number;
//   Message?: string;
//   LifeInsuranceType: "FullLife" | "HalfLife";
// }

// export interface LifePreviewResponse {
//   applicationId: string;
//   clientId: string;
//   categoryName: string;
//   subCategoryName: string;
//   age: number;
//   height: number;
//   weight: number;
//   lifePrice: number;
//   lifeInsuranceType: string;
//   status: string;
//   createdAt: string;
//   message: string;
//   clientFullName: string;
//   clientEmail: string;
//   clientPhoneNumber: string;
//   clientGender: string;
//   clientDateOfBirth: string;
//   clientNationalIdOrPassport: string;
//   clientPassportOrNationalIdImageUrl: string;
// }

// export interface ConfirmLifeApplicationRequest {
//   applicationId: string;
// }

// class LifeApiService {
//   private getAuthHeader() {
//     const token = localStorage.getItem('token'); // Or from your auth context
//     return {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data'
//       }
//     };
//   }

//   // Preview life insurance application
//   async previewLifeApplication(data: LifePreviewRequest): Promise<LifePreviewResponse> {
//     const formData = new FormData();
    
//     // Add all fields to formData
//     formData.append('CategoryId', data.CategoryId);
//     formData.append('SubCategoryId', data.SubCategoryId);
//     formData.append('Age', data.Age.toString());
//     formData.append('Height', data.Height.toString());
//     formData.append('Weight', data.Weight.toString());
    
//     if (data.Message) {
//       formData.append('Message', data.Message);
//     } else {
//       formData.append('Message', 'string'); // Default as per your API
//     }
    
//     formData.append('LifeInsuranceType', data.LifeInsuranceType);

//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/Client/apply/life/preview`,
//         formData,
//         this.getAuthHeader()
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Life preview error:', error);
//       throw error;
//     }
//   }

//   // Confirm life insurance application
//   async confirmLifeApplication(applicationId: string): Promise<LifePreviewResponse> {
//     const requestData: ConfirmLifeApplicationRequest = {
//       applicationId
//     };

//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/Client/apply/life/confirm`,
//         requestData,
//         {
//           headers: {
//             Authorization: this.getAuthHeader().headers.Authorization,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Life confirmation error:', error);
//       throw error;
//     }
//   }

//   // Get life application by ID
//   async getLifeApplication(applicationId: string): Promise<LifePreviewResponse> {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/Client/applications/life/${applicationId}`,
//         this.getAuthHeader()
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Get life application error:', error);
//       throw error;
//     }
//   }

//   // Get all life applications for current user
//   async getUserLifeApplications(): Promise<LifePreviewResponse[]> {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/Client/applications/life`,
//         this.getAuthHeader()
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Get user life applications error:', error);
//       throw error;
//     }
//   }
// }

// export const lifeApiService = new LifeApiService();

// src/services/lifeApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5150/api';

export interface LifePreviewRequest {
  CategoryId: string;
  SubCategoryId: string;
  Age: number;
  Height: number;
  Weight: number;
  Message?: string;
  LifeInsuranceType: "FullLife" | "HalfLife";
}

export interface LifePreviewResponse {
  applicationId: string;
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
  message: string;
  clientFullName: string;
  clientEmail: string;
  clientPhoneNumber: string;
  clientGender: string;
  clientDateOfBirth: string;
  clientNationalIdOrPassport: string;
  clientPassportOrNationalIdImageUrl: string;
}

export interface ConfirmLifeApplicationRequest {
  applicationId: string;
}

class LifeApiService {
  private getAuthHeader() {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token') || '';
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };
  }

  private getJsonAuthHeader() {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token') || '';
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  // Preview life insurance application
  async previewLifeApplication(data: LifePreviewRequest): Promise<LifePreviewResponse> {
    const formData = new FormData();
    
    // Add all fields to formData
    formData.append('CategoryId', data.CategoryId);
    formData.append('SubCategoryId', data.SubCategoryId);
    formData.append('Age', data.Age.toString());
    formData.append('Height', data.Height.toString());
    formData.append('Weight', data.Weight.toString());
    
    if (data.Message) {
      formData.append('Message', data.Message);
    } else {
      formData.append('Message', 'string'); // Default as per your API
    }
    
    formData.append('LifeInsuranceType', data.LifeInsuranceType);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/Client/apply/life/preview`,
        formData,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Life preview error:', error);
      throw error;
    }
  }

  // Confirm life insurance application
  async confirmLifeApplication(applicationId: string): Promise<LifePreviewResponse> {
    const requestData: ConfirmLifeApplicationRequest = {
      applicationId
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/Client/apply/life/confirm`,
        requestData,
        this.getJsonAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Life confirmation error:', error);
      throw error;
    }
  }

  // Get life application by ID
  async getLifeApplication(applicationId: string): Promise<LifePreviewResponse> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Client/applications/life/${applicationId}`,
        this.getJsonAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Get life application error:', error);
      throw error;
    }
  }

  // Get all life applications for current user (from Client endpoint)
  async getUserLifeApplications(): Promise<LifePreviewResponse[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Client/applications/life`,
        this.getJsonAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Get user life applications error:', error);
      throw error;
    }
  }

  // Get pending life applications for finance (from Finance endpoint)
  async getPendingLifeApplications(): Promise<LifePreviewResponse[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Finance/life/pending`,
        this.getJsonAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Get pending life applications error:', error);
      throw error;
    }
  }

  // Update life application status (for finance approval/rejection)
  async updateLifeApplicationStatus(
    applicationId: string, 
    status: 'Approved' | 'Rejected' | 'AwaitingPayment',
    reason?: string
  ): Promise<LifePreviewResponse> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/Finance/life/${applicationId}/status`,
        { status, reason },
        this.getJsonAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Update life application status error:', error);
      throw error;
    }
  }
}

export const lifeApiService = new LifeApiService();