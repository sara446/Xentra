import ProductController from './ProductController';
import MovementController from './MovementController';
import { MOVEMENT_TYPES } from '../models/Movement';
import { isLowStock } from '../models/Product';

const DashboardController = {
  async getSummary() {
    const [products, movements] = await Promise.all([ProductController.getAll(), MovementController.getAll()]);
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = movements.filter((m) => new Date(m.date).getTime() >= weekAgo);
    return {
      totalProducts: products.length,
      lowStock: products.filter(isLowStock).length,
      recentIn: recent.filter((m) => m.type === MOVEMENT_TYPES.IN).length,
      recentOut: recent.filter((m) => m.type === MOVEMENT_TYPES.OUT).length,
    };
  },
};

export default DashboardController;
