import ProductController from './ProductController';
import { isLowStock } from '../models/Product';

const AlertController = {
  async getLowStock() {
    const products = await ProductController.getAll();
    return products.filter(isLowStock);
  },
};

export default AlertController;
