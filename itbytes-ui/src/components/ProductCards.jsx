import { Card, Row, Col, Button } from "antd";

const products = [
  {
    name: "Gaming Monitor",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    image: "/images/monitor.png",
  },
  {
    name: "Smart Tablet",
    gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    image: "/images/tablet.png",
  },
  {
    name: "Wireless CCTV",
    gradient: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
    image: "/images/cctv.png",
  },
];

function ProductCards() {
  return (
    <Row gutter={[16, 16]}>
      {products.map((product, index) => (
        <Col xs={24} sm={24} md={8} key={index}>
          <Card
            className="gradient-card"
            style={{
              background: product.gradient,
              color: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              height: 180,
              display: "flex",
              padding: 0,
            }}
            bodyStyle={{ padding: 0, width: "100%" }}
            hoverable
          >
            <div style={{ display: "flex", height: "100%", width: "100%" }}>
              {/* Left Side Text */}
              <div
                style={{
                  flex: 1,
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h2 style={{ margin: 0, fontSize: 20 }}>{product.name}</h2>
                <Button type="link" style={{ color: "#fff", paddingLeft: 0 }}>
                  Shop now →
                </Button>
              </div>

              {/* Right Side Image */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default ProductCards;
