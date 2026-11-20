import { api } from '../services/api';

const DashboardController = {
  /** { totalProducts, lowStock, recentIn, recentOut } calculado en el backend. */
  getSummary() {
    return api.get('/dashboard');
  },
};

export default DashboardController;
