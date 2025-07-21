# ITBytes-UI

A React-based web application for managing orders, inventory, suppliers, and payments for ITBytes.

## Features

- User authentication
- Product and supplier management
- Cart and order checkout
- Payment integration
- Audit and reporting
- Responsive UI with Ant Design

## Prerequisites

- Node.js (v18 or newer recommended)
- npm (comes with Node.js)
- Backend APIs (User, Inventory, Order, Supplier, Audit, RabbitMQ, etc.) running and accessible

## Installation

```bash
git clone https://github.com/your-org/ITBytes-UI.git
cd ITBytes-UI
npm install
```

## Configuration

Create a `.env` file in the root directory and set your API URLs:

```env
VITE_USER_API_URL=http://localhost:4000/api/user
VITE_INVENTORY_API_URL=http://localhost:4000/api/inventory
VITE_ORDER_API_URL=http://localhost:4000/api/order
VITE_SUPPLIER_API_URL=http://localhost:4000/api/supplier
VITE_AUDIT_API_URL=http://localhost:4000/api/audit
VITE_BANK_API_URL=http://localhost:4000/api/bank
```

*(Adjust URLs as needed for your environment)*

## Launching the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Troubleshooting

- Ensure all backend APIs are running and accessible.
- Check your `.env` file for correct API endpoints.
- If you encounter CORS issues, configure your backend to allow requests from your frontend domain.

## License

MIT

## Support

For issues or feature requests, please open an issue in this
