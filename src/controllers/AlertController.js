import { api } from '../services/api';

const AlertController = {
  /** Productos cuyo stock está por debajo del mínimo. */
  getLowStock() {
    return api.get('/alerts');
  },
};

export default AlertController;
