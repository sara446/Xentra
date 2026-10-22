import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import ProductForm from '../../components/ProductForm';
import { useModal } from '../../components/AppModal';
import ProductController from '../../controllers/ProductController';
import { ROUTES } from '../../navigation/routeNames';
import { font } from '../../theme';

export default function EditProductScreen({ navigation, route }) {
  const { id } = route.params;
  const showModal = useModal();
  const [product, setProduct] = useState(null);

  useEffect(() => { ProductController.getById(id).then(setProduct).catch(() => navigation.goBack()); }, [id]);

  const onDelete = () =>
    showModal({
      type: 'confirm',
      title: '¿Eliminar producto?',
      message: `"${product.name}" se eliminará del inventario. Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      onConfirm: async () => {
        await ProductController.remove(id);
        // Vuelve a la pantalla raíz de la pestaña (Inventario o Inicio)
        navigation.popToTop();
      },
    });

  return (
    <Screen>
      <ScreenHeader title="Editar producto" onBack={() => navigation.goBack()} />
      {product ? (
        <>
          <Text style={font.title}>{product.name}</Text>
          <Text style={[font.small, { marginBottom: 20 }]}>Introduce los cambios que deseas realizar.</Text>
          <ProductForm
            mode="edit"
            initial={product}
            onSubmit={async (data) => {
              await ProductController.update(id, data);
              showModal({
                type: 'success',
                title: 'Cambios guardados',
                message: 'La información del producto se actualizó correctamente.',
                onClose: () => navigation.goBack(),
              });
            }}
            onCancel={() => navigation.goBack()}
            onDelete={onDelete}
          />
        </>
      ) : null}
    </Screen>
  );
}
