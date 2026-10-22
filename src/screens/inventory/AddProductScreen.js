import React from 'react';
import { Text } from 'react-native';
import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import ProductForm from '../../components/ProductForm';
import { useModal } from '../../components/AppModal';
import ProductController from '../../controllers/ProductController';
import { units } from '../../utils/format';
import { ROUTES } from '../../navigation/routeNames';
import { font } from '../../theme';

export default function AddProductScreen({ navigation }) {
  const showModal = useModal();
  return (
    <Screen>
      <ScreenHeader title="Registrar producto" onBack={() => navigation.goBack()} />
      <Text style={font.title}>Nuevo producto</Text>
      <Text style={[font.small, { marginBottom: 20 }]}>Introduce los datos para dar de alta un producto</Text>
      <ProductForm
        mode="create"
        onSubmit={async (data) => {
          const product = await ProductController.create(data);
          showModal({
            type: 'success',
            title: 'Producto agregado',
            message: `"${product.name}" se registró en el inventario con ${units(product.stock)}.`,
            confirmText: 'Ver producto',
            onClose: () => navigation.replace(ROUTES.PRODUCT_DETAIL, { id: product.id }),
          });
        }}
      />
    </Screen>
  );
}
