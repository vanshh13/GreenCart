import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

const OfferPanel = () => {
  const offers = [
    { title: "Summer Sale", description: "Up to 50% off" },
    { title: "Free Delivery", description: "On orders over $50" },
    { title: "Special Bundle", description: "Buy 2 Get 1 Free" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 max-w-7xl mx-auto">
      {offers.map((offer, index) => (
        <Card
          key={index}
          className="bg-[var(--color-surface)] border-[var(--color-border)]"
        >
          <CardHeader>
            <CardTitle className="text-[var(--color-primary)]">
              {offer.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--color-text)]">{offer.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OfferPanel;
