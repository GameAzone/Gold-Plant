import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useApp, PhysicalProduct } from "../context/AppContext";
import { ShoppingBag, CreditCard, Calendar, Award, Package, Truck } from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// Mock product data
const products: PhysicalProduct[] = [
  {
    id: "1",
    name: "1 oz Gold Bar - Latest Design",
    category: "latest",
    price: 2150,
    image: "https://images.unsplash.com/photo-1762463176312-1757d5125c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYmFyJTIwYnVsbGlvbiUyMGx1eHVyeXxlbnwxfHx8fDE3NzE3OTEzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    weight: "1 oz",
    purity: "99.99%",
    description: "Premium gold bar with modern minting design, certified and sealed",
  },
  {
    id: "2",
    name: "Gold Coin - Modern Edition",
    category: "latest",
    price: 2200,
    image: "https://images.unsplash.com/photo-1761479265833-637567873027?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwY29pbiUyMGVsZWdhbnQlMjBsdXh1cnl8ZW58MXx8fHwxNzcxODMxMDM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    weight: "1 oz",
    purity: "99.99%",
    description: "Limited edition gold coin with intricate modern design",
  },
  {
    id: "3",
    name: "Designer Gold Pendant",
    category: "latest",
    price: 1850,
    image: "https://images.unsplash.com/photo-1771173652661-8245a9d94095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwamV3ZWxyeSUyMG1vZGVybiUyMGRlc2lnbnxlbnwxfHx8fDE3NzE4MzEwMzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    weight: "0.75 oz",
    purity: "99.9%",
    description: "Contemporary gold jewelry piece with unique modern aesthetics",
  },
  {
    id: "4",
    name: "5 oz Gold Ingot - Premium",
    category: "latest",
    price: 10500,
    image: "https://images.unsplash.com/photo-1762463176319-8416bf1e6a8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnb2xkJTIwaW5nb3R8ZW58MXx8fHwxNzcxODMxMDM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    weight: "5 oz",
    purity: "99.99%",
    description: "Large format gold ingot for serious collectors and investors",
  },
  {
    id: "5",
    name: "Heritage Gold Collection Bar",
    category: "collection",
    price: 2350,
    image: "https://images.unsplash.com/photo-1762463176312-1757d5125c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYmFyJTIwYnVsbGlvbiUyMGx1eHVyeXxlbnwxfHx8fDE3NzE3OTEzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    weight: "1 oz",
    purity: "99.99%",
    description: "Collectible gold bar featuring heritage design elements",
  },
  {
    id: "6",
    name: "Vintage Gold Coin Set",
    category: "collection",
    price: 4500,
    image: "https://images.unsplash.com/photo-1762049213134-008e36819c1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwZ29sZCUyMGNvaW4lMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc3MTgzMTAzNXww&ixlib=rb-4.1.0&q=80&w=1080",
    weight: "2 oz total",
    purity: "99.9%",
    description: "Rare collection set of vintage gold coins with historical significance",
  },
  {
    id: "7",
    name: "Classic Gold Bar Collection",
    category: "collection",
    price: 3200,
    image: "https://images.unsplash.com/photo-1762463176319-8416bf1e6a8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnb2xkJTIwaW5nb3R8ZW58MXx8fHwxNzcxODMxMDM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    weight: "1.5 oz",
    purity: "99.99%",
    description: "Premium collection piece with traditional craftsmanship",
  },
  {
    id: "8",
    name: "10 oz Silver Bar Premium",
    category: "latest",
    price: 285,
    image: "https://images.unsplash.com/photo-1641324113963-073b4b8dc86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBiYXIlMjBidWxsaW9ufGVufDF8fHx8MTc3MTgzMTAzNXww&ixlib=rb-4.1.0&q=80&w=1080",
    weight: "10 oz",
    purity: "99.9%",
    description: "High-quality silver bar perfect for diversified portfolio",
  },
];

export default function Marketplace() {
  const { balance, addPhysicalOrder, physicalOrders } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<PhysicalProduct | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [paymentType, setPaymentType] = useState<"full" | "bnpl">("full");
  const [bnplMonths, setBnplMonths] = useState("12");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<"all" | "latest" | "collection">("all");

  const filteredProducts = products.filter(
    (product) => filterCategory === "all" || product.category === filterCategory
  );

  const handlePurchase = () => {
    if (!selectedProduct) return;

    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    const total = selectedProduct.price * qty;

    if (paymentType === "full" && total > balance) {
      toast.error("Insufficient balance for full payment");
      return;
    }

    const months = parseInt(bnplMonths);
    const monthlyPayment = paymentType === "bnpl" ? total / months : undefined;

    addPhysicalOrder({
      product: selectedProduct,
      quantity: qty,
      total,
      paymentType,
      bnplMonths: paymentType === "bnpl" ? months : undefined,
      monthlyPayment,
      status: "pending",
    });

    toast.success(
      `Order placed successfully! ${
        paymentType === "bnpl"
          ? `Pay RM${monthlyPayment?.toFixed(2)}/month for ${months} months`
          : "Paid in full"
      }`
    );

    setIsDialogOpen(false);
    setQuantity("1");
    setPaymentType("full");
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Physical Gold Marketplace</h2>
        <p className="text-sm md:text-base text-slate-600">
          Browse and purchase physical gold products with our Buy Now Pay Later program
        </p>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <Tabs value={filterCategory} onValueChange={(v) => setFilterCategory(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="text-xs md:text-sm">All</TabsTrigger>
              <TabsTrigger value="latest" className="text-xs md:text-sm">Latest</TabsTrigger>
              <TabsTrigger value="collection" className="text-xs md:text-sm">Collection</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative overflow-hidden bg-slate-100">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.category === "latest"
                      ? "bg-green-500 text-white"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {product.category === "latest" ? "Latest" : "Collection"}
                </span>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-base">{product.name}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span>{product.weight}</span>
                <span>•</span>
                <span>{product.purity}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    RM{product.price.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500">
                    or RM{(product.price / 12).toFixed(2)}/mo
                  </div>
                </div>
                <Dialog open={isDialogOpen && selectedProduct?.id === product.id} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-amber-600 hover:bg-amber-700"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Buy
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Purchase {product.name}</DialogTitle>
                      <DialogDescription>
                        Complete your purchase details below
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      {/* Product Info */}
                      <div className="flex gap-4">
                        <div className="w-32 h-32 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-900 mb-2">{product.name}</h3>
                          <div className="space-y-1 text-sm text-slate-600">
                            <p>Weight: {product.weight}</p>
                            <p>Purity: {product.purity}</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">
                              RM{product.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          min="1"
                        />
                      </div>

                      {/* Payment Method */}
                      <div className="space-y-4">
                        <Label>Payment Method</Label>
                        <Tabs value={paymentType} onValueChange={(v) => setPaymentType(v as any)}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="full">
                              <CreditCard className="w-4 h-4 mr-2" />
                              Pay in Full
                            </TabsTrigger>
                            <TabsTrigger value="bnpl">
                              <Calendar className="w-4 h-4 mr-2" />
                              Buy Now Pay Later
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="full" className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-600">Total Amount:</span>
                                <span className="text-xl font-bold text-slate-900">
                                  RM{(product.price * parseInt(quantity || "1")).toFixed(2)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">
                                Available Balance: RM{balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          </TabsContent>
                          <TabsContent value="bnpl" className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="bnpl-months">Payment Plan</Label>
                              <select
                                id="bnpl-months"
                                value={bnplMonths}
                                onChange={(e) => setBnplMonths(e.target.value)}
                                className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"
                              >
                                <option value="6">6 months</option>
                                <option value="12">12 months</option>
                                <option value="18">18 months</option>
                                <option value="24">24 months</option>
                              </select>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-600">Monthly Payment:</span>
                                <span className="text-xl font-bold text-blue-700">
                                  RM{((product.price * parseInt(quantity || "1")) / parseInt(bnplMonths)).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm text-slate-600">
                                <span>Total Amount:</span>
                                <span>RM{(product.price * parseInt(quantity || "1")).toFixed(2)}</span>
                              </div>
                              <p className="text-xs text-blue-600 mt-2">
                                0% interest • No hidden fees • Cancel anytime
                              </p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="flex-1 bg-amber-600 hover:bg-amber-700"
                          onClick={handlePurchase}
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Confirm Purchase
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Orders */}
      {physicalOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {physicalOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                      <ImageWithFallback
                        src={order.product.image}
                        alt={order.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{order.product.name}</div>
                      <div className="text-sm text-slate-600">Quantity: {order.quantity}</div>
                      <div className="text-xs text-slate-500">
                        {order.date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">${order.total.toFixed(2)}</div>
                    {order.paymentType === "bnpl" && (
                      <div className="text-xs text-blue-600">
                        ${order.monthlyPayment?.toFixed(2)}/mo × {order.bnplMonths}
                      </div>
                    )}
                    <div className="mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* BNPL Info */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Buy Now Pay Later Program</h3>
              <p className="text-sm text-blue-800 mb-3">
                Purchase premium physical gold products with flexible payment plans. No interest, no
                hidden fees - split your payment into convenient monthly installments.
              </p>
              <ul className="space-y-1 text-sm text-blue-800">
                <li className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>0% interest on all payment plans</span>
                </li>
                <li className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Secure storage until fully paid</span>
                </li>
                <li className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Free insured shipping on completion</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}