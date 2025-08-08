import Footer from "../Common/Layouts/Footer";
import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";
import { Link } from "react-router-dom";
import "../Customers/RechargeScreen.css";
import { toast } from "react-toastify";
import NewsMarquee from "../Customers/NewsMarquee";
import moment from "moment";
import CustomerRecharge from "./CustomerRecharge";
import { handleSuccess } from "../Common/Layouts/CustomAlerts";

const Recharge = () => {
  const [quantity, setQuantity] = useState("1000");
  const [displayQuantity, setDisplayQuantity] = useState(1);
  const [amount, setAmount] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gasPriceData, setGasPriceData] = useState({});
  const [deviceData, setDeviceData] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const headerconfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  const resetFormFields = () => {
    setDisplayQuantity(gasPriceData.quantity);
    setQuantity(gasPriceData.quantity);
    setAmount(gasPriceData.pricePerKg);
  };
  const handlePrice = (e) => {
    const price = parseFloat(e.target.value);
    if (isNaN(price) || price < 1) {
      alert('Enter valid price');
      setQuantity(gasPriceData.quantity);
      setAmount(gasPriceData.pricePerKg);
      setDisplayQuantity(gasPriceData.quantity);
      return;
    }
    if (price > 0) {
      setAmount(price);
      const totalKg = price / parseFloat(gasPriceData.pricePerKg);
      const totalKgFixed = totalKg.toFixed(6);
      setQuantity(totalKgFixed);
      setDisplayQuantity(totalKg);
    }
  };
  const handleQuantity = (e) => {
    const quantity = parseInt(e.target.value);
    if (isNaN(quantity) || quantity < 1) {
      alert('Enter valid quantity');
      setQuantity(gasPriceData.quantity);
      setAmount(gasPriceData.pricePerKg);
      setDisplayQuantity(gasPriceData.quantity);
      return;
    }

    if (quantity > 0) {
      setAmount(quantity * parseFloat(gasPriceData.pricePerKg));
      const totalKgFixed = quantity.toFixed(6);
      setQuantity(totalKgFixed);
      setDisplayQuantity(quantity);
    }
  };
  const GetGasPrice = () => {
    axios
      .get(config.APIACTIVATEURL + config.GETGASPRICEPERKG, headerconfig)
      .then((response) => {
        if (response.data.statusCode === 200) {
          setGasPriceData(response.data.data);
          setAmount(response.data.data.price);
          setDisplayQuantity(response.data.data.quantity);
          const q = response.data.data.quantity;
          setQuantity(q.toFixed(6));
        }
      })
  };
  const GetUserDevice = () => {
    axios
      .get(config.APIACTIVATEURL + config.GETDEVICEBYUSER + "?UserId=" + localStorage.getItem("userId"), headerconfig)
      .then((response) => {
        if (response.data.statusCode === 200) {
          setDeviceData(response.data.data);
          console.log(response.data.data);
        }
      })
  };
  useEffect(() => {
    GetGasPrice();
    GetUserDevice();
  }, []);
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }
  const handleRecharge = async () => {
    setLoading(true);
    try {
      await processPayment(amount, quantity);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const processPayment = async (amount, quantity) => {
    setLoading(true);
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Razorpay SDK failed to load.");
      setLoading(false);
      return;
    }

    try {
      const paymentResponse = await axios.post(
        `${config.APIACTIVATEURL}${config.PAYMENTORDERREQUEST
        }?Amount=${Math.round(amount)}&PayRequest=RAZORPAY`,
        headerconfig
      );

      if (paymentResponse.data && paymentResponse.data.statusCode === 200) {
        const {
          orderId,
          razorpayKey,
          amount: razorpayAmount,
          currency,
          name,
        } = paymentResponse.data.response;

        const paymentHandler = async (response) => {
          try {
            const rechargeData = {
              userId: deviceData.userId,
              deviceId: deviceData.deviceId,
              quantity,
              amount: amount,
              pricePerKg: gasPriceData.pricePerKg,
              paymentStatus: "Success",
              paymentGatewayNo: response.razorpay_payment_id,
              rechargeStatus: "Processing",
              endDeviceId: deviceData.endDeviceId
            };
            const rechargeResponse = await axios.post(
              `${config.APIACTIVATEURL}${config.CREATERECHARGE}`,
              rechargeData,
              headerconfig
            );

            if (rechargeResponse.data && rechargeResponse.data.statusCode === 200) {
              setRefreshKey((prevKey) => prevKey + 1);
              handleSuccess("Recharge successfully initiated!");
              resetFormFields();
            } else {
              throw new Error("Recharge creation failed after payment");
            }
          } catch (error) {
            console.error("Post-payment recharge error:", error);
            toast.error("Payment succeeded but recharge failed");
          } finally {
            setLoading(false);
          }
        };

        const options = {
          key: razorpayKey,
          amount: Math.round(amount * 100),
          currency,
          name,
          description: "Gas Recharge Payment",
          order_id: orderId,
          handler: paymentHandler,
          prefill: {
            name: localStorage.getItem("userName") || "Customer",
            email: localStorage.getItem("email") || "customer@example.com",
            contact: localStorage.getItem("phoneNumber") || "9999999999",
          },
          theme: { color: "#F37254" },
          modal: {
            ondismiss: () => {
              toast.info("Payment window closed");
              setLoading(false);
            },
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        throw new Error("Failed to create payment order");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initialize payment");
      setLoading(false);
    }
  };
  return (
    <div id="layout-wrapper">
      <Header />
      <SideBar />

      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                  <h4 className="mb-sm-0">Gas Recharge</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <Link>Home</Link>
                      </li>
                      <li className="breadcrumb-item active">Gas Recharge</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-12">
                        <NewsMarquee />
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-md-6">
                        <div className="card recharge-card">
                          <div className="card-body">
                            <h5 className="card-title">Recharge Options</h5>
                            <div className="alert alert-dark">
                              Today's Price |<strong> {gasPriceData.price} per Kg</strong>
                              <br />
                              <small className="text-muted">{moment(gasPriceData.createdDate).format("DD MMM YYYY hh:mm a")}</small>
                            </div>
                            <div className="recharge-options">
                              <div className="option-card">
                                <div className="option-content">
                                  <span className="option-label">Kg</span>
                                  <input type="number" onChange={handleQuantity} className="form-control text-center" value={displayQuantity} />
                                </div>
                              </div>
                              <div className="option-divider">OR</div>
                              <div className={`option-card`}>
                                <div className="option-content">
                                  <span className="option-label">Rs</span>
                                  <input type="number" onChange={handlePrice} className="form-control text-center" value={amount} />
                                </div>
                              </div>
                            </div>
                            {loading === false ?
                              <button className="btn btn-primary w-100 mt-3 recharge-button" onClick={handleRecharge}> Recharge</button> :
                              <button className="btn btn-primary w-100 mt-3 recharge-button" disabled> Processing...</button>}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card info-card">
                          <CustomerRecharge key={refreshKey}></CustomerRecharge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recharge;
