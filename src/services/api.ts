import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.13:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Clinic APIs ─────────────────────────────────────────────────────────────
// GET /api/clinic/pending          — pending clinics (isApproved: false)
// GET /api/clinic/all              — all clinics with optional filters
// PUT /api/clinic/:id/approve      — approve a clinic
// PUT /api/clinic/:id/reject       — reject a clinic
export const clinicAPI = {
  getPendingClinics: (params?: { page?: number; limit?: number }) =>
    api.get('/clinic/pending', { params }),

  getAllClinics: (params?: { isApproved?: boolean | string; search?: string; page?: number; limit?: number }) =>
    api.get('/clinic/all', { params }),

  approveClinic: (clinicId: string) =>
    api.put(`/clinic/${clinicId}/approve`),

  rejectClinic: (clinicId: string, rejectionReason: string) =>
    api.put(`/clinic/${clinicId}/reject`, { rejectionReason }),

  getClinicById: (clinicId: string) =>
    api.get(`/clinic/${clinicId}`),
};

// ─── User / Doctor Approval APIs ─────────────────────────────────────────────
// GET /api/user/pending-users      — users pending super_admin approval
//                                    query: role (owner|sr_doctor|jr_doctor), search, page, limit
// GET /api/user/all                — all users with optional filters
// PUT /api/user/approve/:userId    — approve or reject a user + optionally assign role
//                                    body: { isApproved: true/false, rejectionReason?, approvedBy? }
export const userAPI = {
  getPendingUsers: (params?: { role?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/user/pending-users', { params }),

  getAllUsers: (params?: { role?: string; search?: string; isActive?: boolean; isVerified?: boolean; isApproved?: boolean; page?: number; limit?: number }) =>
    api.get('/user/all', { params }),

  approveUser: (userId: string, roles?: string[], approvedBy?: string) =>
    api.put(`/user/approve/${userId}`, { isApproved: true, roles, approvedBy }),

  rejectUser: (userId: string, rejectionReason: string) =>
    api.put(`/user/approve/${userId}`, { isApproved: false, rejectionReason }),

  toggleUserDegreeApproval: (userId: string, degreeId: string, isApproved: boolean) =>
    api.put(`/user/approve/${userId}`, { targetDegreeId: degreeId, targetDegreeApproved: isApproved }),

  getUserById: (userId: string) =>
    api.get(`/user/profile`), // uses token — for current user only

  getProfile: () =>
    api.get('/user/profile'),

    // GET /api/user/clinic-requests — join requests for the logged-in user (or any userId for admin)
  getClinicJoinRequests: (params?: { userId?: string; status?: string; page?: number; limit?: number }) =>
    api.get('/user/clinic-requests', { params }),

  // GET /api/clinic/join-requests — owner sees all join requests for their clinic(s)
  // PUT /api/clinic/join-requests/:userId — owner approves/rejects a join request
  getOwnerJoinRequests: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/clinic/join-requests', { params }),

  approveRejectJoinRequest: (userId: string, clinicId: string, action: 'approve' | 'reject', rejectionReason?: string) =>
    api.put(`/clinic/join-requests/${userId}`, { clinicId, action, rejectionReason }),
};

// ─── Dashboard APIs ───────────────────────────────────────────────────────────
// Aggregates counts from real endpoints since there is no dedicated stats endpoint
export const dashboardAPI = {
  // Returns { pendingClinics, totalClinics, pendingUsers, totalUsers }
  getStats: async () => {
    const [pendingClinics, allClinics, pendingUsers, allUsers] = await Promise.allSettled([
      api.get('/clinic/pending', { params: { limit: 1 } }),
      api.get('/clinic/all', { params: { limit: 1 } }),
      api.get('/user/pending-users', { params: { limit: 1 } }),
      api.get('/user/all', { params: { limit: 1 } }),
    ]);

    const get = (result: PromiseSettledResult<any>, path: string) => {
      if (result.status === 'fulfilled') {
        const parts = path.split('.');
        let val: any = result.value.data;
        for (const p of parts) val = val?.[p];
        return val ?? 0;
      }
      return 0;
    };

    return {
      data: {
        data: {
          pendingClinics: get(pendingClinics, 'pagination.total'),
          totalClinics:   get(allClinics,     'pagination.total'),
          pendingDoctors: 0, // included in pendingUsers below
          totalDoctors:   0,
          pendingUsers:   get(pendingUsers,   'pagination.total'),
          totalUsers:     get(allUsers,       'pagination.total'),
        },
      },
    };
  },
};

export default api;
