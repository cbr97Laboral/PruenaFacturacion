import PropTypes from 'prop-types';
import ClientContent from './Catalogo/Clientes/ClientContent';
import ProductsContent from './Catalogo/Productos/ProductsContent';
import InvoiceContent from './Documentos/Factura/InvoiceContent';

const Content = ({ selectedMenu }) => {
  let content = null;

  switch (selectedMenu) {
    case 'Clientes':
      content = <ClientContent />;
      break;
    case 'Productos':
      content = <ProductsContent />;
      break;
    case 'Factura':
      content = <InvoiceContent />;
      break;
    default:
      break;
  }
  
  return <div>{content}</div>;
};

Content.propTypes = {
  selectedMenu: PropTypes.string.isRequired,
};

export default Content;
