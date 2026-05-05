import { useState, useEffect } from "react";

const initialMeasurements = {
  length: "", shoulder: "", arm: "", chest: "", waist: "",
  front: "", daman: "", collar: "", shalwarLength: "", pauncha: "",
  aasan: "", ghera: ""
};

const initialOrder = {
  id: null, bookingNo: "", customerCode: "", customerName: "",
  bookDate: "", deliveryDate: "",
  size1: { ...initialMeasurements }, size2: { ...initialMeasurements },
  armStyle: "", cuffStyle: "", btnPatti: "", pocketStyle: "", collarStyle: "",
  nokdarTera: false, kafDblKaj: false, pattiDblBukram: false,
  noLbl: false, shoulderPatti: false, kajPatti: false,
  buttonQty: "", buttonType: "", extras: "",
  shalwarZip: "none", darz: "none", sidePocket: "none",
  bainStyle: "none", bainSize: "", damanStyle: "none",
  designButton: "", designSuit: "",
  type: "regular", remarks: "",
  items: [], status: "pending"
};

const SHOULDER_DOWN_OPTIONS = ["Shoulder down", "Shoulder up", "Custom"];
const BUTTON_QTY_OPTIONS = ["4 Button", "5 Button", "6 Button", "7 Button"];
const BUTTON_TYPE_OPTIONS = ["Plastic", "Metal", "Fabric Covered", "Pearl"];

export default function TailorApp() {
  const [view, setView] = useState("dashboard");
  const [orders, setOrders] = useState([
    { ...initialOrder, id: 1, bookingNo: "BK-001", customerCode: "C001", customerName: "Ahmad Khan", bookDate: "2026-05-01", deliveryDate: "2026-05-08", status: "delivered", type: "regular" },
    { ...initialOrder, id: 2, bookingNo: "BK-002", customerCode: "C002", customerName: "Bilal Ahmed", bookDate: "2026-05-03", deliveryDate: "2026-05-10", status: "in-progress", type: "regular" },
    { ...initialOrder, id: 3, bookingNo: "BK-003", customerCode: "C003", customerName: "Zafar Iqbal", bookDate: "2026-05-04", deliveryDate: "2026-05-12", status: "pending", type: "balochi" },
  ]);
  const [customers, setCustomers] = useState([
    { id: "C001", name: "Ahmad Khan", phone: "0300-1234567", address: "Mardan" },
    { id: "C002", name: "Bilal Ahmed", phone: "0311-9876543", address: "Peshawar" },
    { id: "C003", name: "Zafar Iqbal", phone: "0333-5554444", address: "Swabi" },
  ]);
  const [form, setForm] = useState({ ...initialOrder });
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [nextId, setNextId] = useState(4);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ id: "", name: "", phone: "", address: "" });
  const [addingCustomer, setAddingCustomer] = useState(false);

  const recordNo = `REC-${String(nextId).padStart(4, "0")}`;

  const resetForm = () => {
    setForm({ ...initialOrder });
    setEditingOrder(null);
  };

  const handleSave = () => {
    if (!form.customerName || !form.bookDate || !form.deliveryDate) {
      alert("Please fill Customer, Book Date and Delivery Date.");
      return;
    }
    if (editingOrder !== null) {
      setOrders(prev => prev.map(o => o.id === editingOrder ? { ...form, id: editingOrder } : o));
    } else {
      const newOrder = { ...form, id: nextId, bookingNo: `BK-${String(nextId).padStart(3, "0")}` };
      setOrders(prev => [...prev, newOrder]);
      setNextId(n => n + 1);
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    resetForm();
    setView("orders");
  };

  const handleEdit = (order) => {
    setForm({ ...order });
    setEditingOrder(order.id);
    setView("newOrder");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this order?")) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const handleAddCustomer = () => {
    if (!newCustomer.id || !newCustomer.name) return;
    setCustomers(prev => [...prev, newCustomer]);
    setNewCustomer({ id: "", name: "", phone: "", address: "" });
    setAddingCustomer(false);
  };

  const selectCustomer = (c) => {
    setForm(f => ({ ...f, customerCode: c.id, customerName: c.name }));
    setSearchCustomer("");
  };

  const filteredOrders = orders.filter(o =>
    o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.bookingNo.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const statusColor = (s) => ({ pending: "#f59e0b", "in-progress": "#3b82f6", delivered: "#10b981", cancelled: "#ef4444" }[s] || "#6b7280");

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    inProgress: orders.filter(o => o.status === "in-progress").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif", minHeight: "100vh", background: "#f0f4f8", color: "#1a202c" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a3a2a 0%, #2d6a4f 100%)", padding: "0", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 20px", gap: "16px" }}>
          <div style={{ background: "#d4a017", borderRadius: "8px", padding: "8px 14px", fontWeight: "800", fontSize: "20px", color: "#1a3a2a", letterSpacing: "1px" }}>✂</div>
          <div>
            <div style={{ color: "#d4a017", fontWeight: "800", fontSize: "20px", letterSpacing: "2px" }}>DARAZ TAILOR</div>
            <div style={{ color: "#a7c4b5", fontSize: "11px", letterSpacing: "3px" }}>SHALWAR QAMEEZ MANAGEMENT</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
            {[
              { key: "dashboard", label: "📊 Dashboard" },
              { key: "newOrder", label: "➕ New Order" },
              { key: "orders", label: "📋 Orders" },
              { key: "customers", label: "👥 Customers" },
            ].map(item => (
              <button key={item.key} onClick={() => { setView(item.key); if (item.key === "newOrder") resetForm(); }}
                style={{ background: view === item.key ? "#d4a017" : "rgba(255,255,255,0.1)", color: view === item.key ? "#1a3a2a" : "#e8f5e9", border: "none", borderRadius: "6px", padding: "7px 14px", cursor: "pointer", fontWeight: view === item.key ? "700" : "500", fontSize: "13px", transition: "all 0.2s" }}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showSuccess && (
        <div style={{ background: "#10b981", color: "white", padding: "10px 20px", textAlign: "center", fontWeight: "600", fontSize: "14px" }}>
          ✅ Order saved successfully!
        </div>
      )}

      <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>

        {/* ─── DASHBOARD ─── */}
        {view === "dashboard" && (
          <div>
            <h2 style={{ color: "#1a3a2a", fontWeight: "800", fontSize: "22px", marginBottom: "20px" }}>Dashboard Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
              {[
                { label: "Total Orders", value: stats.total, color: "#2d6a4f", icon: "📦" },
                { label: "Pending", value: stats.pending, color: "#d97706", icon: "⏳" },
                { label: "In Progress", value: stats.inProgress, color: "#2563eb", icon: "🧵" },
                { label: "Delivered", value: stats.delivered, color: "#059669", icon: "✅" },
              ].map(card => (
                <div key={card.label} style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", borderLeft: `4px solid ${card.color}` }}>
                  <div style={{ fontSize: "28px", marginBottom: "4px" }}>{card.icon}</div>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: card.color }}>{card.value}</div>
                  <div style={{ fontSize: "13px", color: "#6b7280", fontWeight: "600" }}>{card.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <h3 style={{ color: "#1a3a2a", fontWeight: "700", marginBottom: "16px", fontSize: "16px" }}>Recent Orders</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f0f4f8" }}>
                    {["Booking #", "Customer", "Book Date", "Delivery Date", "Type", "Status"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(-5).reverse().map(o => (
                    <tr key={o.id} style={{ borderBottom: "1px solid #f0f4f8" }}>
                      <td style={{ padding: "10px 12px", fontWeight: "600", color: "#2d6a4f" }}>{o.bookingNo}</td>
                      <td style={{ padding: "10px 12px" }}>{o.customerName}</td>
                      <td style={{ padding: "10px 12px", color: "#6b7280", fontSize: "13px" }}>{o.bookDate}</td>
                      <td style={{ padding: "10px 12px", color: "#6b7280", fontSize: "13px" }}>{o.deliveryDate}</td>
                      <td style={{ padding: "10px 12px", textTransform: "capitalize" }}>{o.type}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ background: statusColor(o.status) + "22", color: statusColor(o.status), padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize" }}>{o.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── NEW ORDER FORM ─── */}
        {view === "newOrder" && (
          <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 20px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            {/* Form Header */}
            <div style={{ background: "linear-gradient(135deg, #1a3a2a, #2d6a4f)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "#d4a017", fontWeight: "800", fontSize: "18px", letterSpacing: "1px" }}>✂ Shalwar Qameez Order</span>
              <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ background: "rgba(255,255,255,0.15)", color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "13px" }}>F7: <b style={{ color: "#d4a017" }}>1/4</b></span>
                <span style={{ background: "rgba(255,255,255,0.15)", color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "13px" }}>F8: <b style={{ color: "#d4a017" }}>1/2</b></span>
                <span style={{ background: "rgba(255,255,255,0.15)", color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "13px" }}>F9: <b style={{ color: "#d4a017" }}>3/4</b></span>
              </div>
            </div>

            <div style={{ padding: "20px" }}>
              {/* Top Meta Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <label style={labelStyle}>Record No.</label>
                    <input value={editingOrder ? `REC-${String(editingOrder).padStart(4,"0")}` : recordNo} readOnly style={{ ...inputStyle, background: "#f0f4f8", color: "#6b7280", flex: 1 }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <label style={labelStyle}>Customer</label>
                    <div style={{ position: "relative", flex: 1, display: "flex", gap: "4px" }}>
                      <input placeholder="Code" value={form.customerCode} onChange={e => setForm(f => ({ ...f, customerCode: e.target.value }))} style={{ ...inputStyle, width: "80px" }} />
                      <input placeholder="Name" value={form.customerName}
                        onChange={e => { setForm(f => ({ ...f, customerName: e.target.value })); setSearchCustomer(e.target.value); }}
                        style={{ ...inputStyle, flex: 1 }} />
                      <button style={{ background: "#2d6a4f", color: "white", border: "none", borderRadius: "6px", padding: "0 12px", cursor: "pointer", fontSize: "16px" }}
                        onClick={() => setSearchCustomer(form.customerName || " ")}>🔍</button>
                      {searchCustomer && customers.filter(c => c.name.toLowerCase().includes(searchCustomer.toLowerCase())).length > 0 && (
                        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "1px solid #e2e8f0", borderRadius: "6px", zIndex: 100, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", maxHeight: "150px", overflowY: "auto" }}>
                          {customers.filter(c => c.name.toLowerCase().includes(searchCustomer.toLowerCase())).map(c => (
                            <div key={c.id} onClick={() => selectCustomer(c)} style={{ padding: "8px 12px", cursor: "pointer", fontSize: "13px", borderBottom: "1px solid #f0f4f8" }}
                              onMouseEnter={e => e.target.style.background = "#f0fdf4"} onMouseLeave={e => e.target.style.background = "white"}>
                              <b>{c.id}</b> — {c.name} <span style={{ color: "#6b7280" }}>({c.phone})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <label style={labelStyle}>Book Date</label>
                    <input type="date" value={form.bookDate} onChange={e => setForm(f => ({ ...f, bookDate: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <label style={labelStyle}>Booking No.</label>
                    <input placeholder="Auto" value={form.bookingNo} onChange={e => setForm(f => ({ ...f, bookingNo: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <label style={labelStyle}>Delivery Date</label>
                    <input type="date" value={form.deliveryDate} onChange={e => setForm(f => ({ ...f, deliveryDate: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <label style={labelStyle}>Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ ...inputStyle, flex: 1 }}>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Measurements + Options */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
                {/* Left: Measurements */}
                <div>
                  <div style={sectionHeader}>📏 Measurements</div>
                  <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginBottom: "8px", background: "#2d6a4f", color: "white", padding: "6px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", textAlign: "center" }}>
                      <span>Measurement</span><span>Size 1</span><span>Size 2</span>
                    </div>
                    {[
                      ["لمباٸ / Length", "length"], ["تنرا / Shoulder", "shoulder"], ["بازو / Arm", "arm"],
                      ["چھاتی / Chest", "chest"], ["کمر / Waist", "waist"], ["فرنٹ / Front", "front"],
                      ["دامن / Daman", "daman"], ["کالر / Collar", "collar"], ["شلوار لمباٸ", "shalwarLength"],
                      ["پانچہ", "pauncha"], ["آسن", "aasan"], ["گھیر", "ghera"]
                    ].map(([label, key]) => (
                      <div key={key} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", alignItems: "center", marginBottom: "4px" }}>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", textAlign: "right", paddingRight: "8px" }}>{label}</label>
                        <input value={form.size1[key] || ""} onChange={e => setForm(f => ({ ...f, size1: { ...f.size1, [key]: e.target.value } }))} style={{ ...inputStyle, fontSize: "12px", padding: "5px 8px" }} />
                        <input value={form.size2[key] || ""} onChange={e => setForm(f => ({ ...f, size2: { ...f.size2, [key]: e.target.value } }))} style={{ ...inputStyle, fontSize: "12px", padding: "5px 8px" }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Style Options */}
                <div>
                  <div style={sectionHeader}>🎨 Style Options</div>
                  <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "12px", border: "1px solid #e2e8f0" }}>
                    {/* Style buttons row */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
                      {[
                        ["بازو / Arm", "armStyle", ["Round", "Straight", "Angled"]],
                        ["کف / Cuff", "cuffStyle", ["Simple", "Double", "French"]],
                        ["بٹن پٹی / Btn Patti", "btnPatti", ["Simple", "Double", "Kaf"]],
                        ["جیب / Pocket", "pocketStyle", ["None", "Chest", "Side", "Both"]],
                        ["کالر / Collar", "collarStyle", ["Band", "Spread", "Mandarin", "Nehru"]],
                        ["Shoulder", "shoulderDir", SHOULDER_DOWN_OPTIONS],
                      ].map(([label, key, opts]) => (
                        <div key={key} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px", alignItems: "center" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "white", background: "#2d6a4f", padding: "5px 8px", borderRadius: "4px", textAlign: "center" }}>{label}</label>
                          <select value={form[key] || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ ...inputStyle, fontSize: "12px" }}>
                            <option value="">Select...</option>
                            {opts.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>

                    {/* Checkboxes */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "12px" }}>
                      {[
                        ["nokdarTera", "Nokdar Tera"], ["kafDblKaj", "Kaf Dbl Kaj"],
                        ["pattiDblBukram", "Patti Dbl Bukram"], ["noLbl", "No Lbl"],
                        ["shoulderPatti", "Shoulder Patti"], ["kajPatti", "Kaj Patti"]
                      ].map(([key, label]) => (
                        <label key={key} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer", color: "#374151" }}>
                          <input type="checkbox" checked={form[key] || false} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} style={{ accentColor: "#2d6a4f" }} />
                          {label}
                        </label>
                      ))}
                    </div>

                    {/* Button Qty/Type */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", display: "block", marginBottom: "3px" }}>BUTTON QTY</label>
                        <select value={form.buttonQty} onChange={e => setForm(f => ({ ...f, buttonQty: e.target.value }))} style={{ ...inputStyle, fontSize: "12px" }}>
                          <option value="">Select...</option>
                          {BUTTON_QTY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", display: "block", marginBottom: "3px" }}>BUTTON TYPE</label>
                        <select value={form.buttonType} onChange={e => setForm(f => ({ ...f, buttonType: e.target.value }))} style={{ ...inputStyle, fontSize: "12px" }}>
                          <option value="">Select...</option>
                          {BUTTON_TYPE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Radio Groups */}
                    {[
                      ["Shalwar Zip", "shalwarZip", ["1 Shalwar Zip", "2 Shalwar Zip", "None"]],
                      ["Darz", "darz", ["6 Darz", "2 Darz", "None"]],
                      ["Side Pocket", "sidePocket", ["1 Side Pocket", "2 Side Pocket", "None"]],
                    ].map(([label, key, opts]) => (
                      <div key={key} style={{ marginBottom: "8px" }}>
                        <label style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", display: "block", marginBottom: "4px", textTransform: "uppercase" }}>{label}</label>
                        <div style={{ display: "flex", gap: "12px" }}>
                          {opts.map(opt => (
                            <label key={opt} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", cursor: "pointer" }}>
                              <input type="radio" name={key} value={opt.toLowerCase().replace(/\s+/g, "-")} checked={form[key] === opt.toLowerCase().replace(/\s+/g, "-")} onChange={() => setForm(f => ({ ...f, [key]: opt.toLowerCase().replace(/\s+/g, "-") }))} style={{ accentColor: "#2d6a4f" }} />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Bain Style */}
                    <div style={{ marginBottom: "8px" }}>
                      <label style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", display: "block", marginBottom: "4px", textTransform: "uppercase" }}>Bain Style</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
                        {["Gol Bain", "Sida Bain", "Half Bain", "Half Bain Gol", "Gol Gala", "None"].map(opt => (
                          <label key={opt} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", cursor: "pointer" }}>
                            <input type="radio" name="bainStyle" value={opt} checked={form.bainStyle === opt} onChange={() => setForm(f => ({ ...f, bainStyle: opt }))} style={{ accentColor: "#2d6a4f" }} />
                            {opt}
                          </label>
                        ))}
                      </div>
                      <input placeholder="Bain size" value={form.bainSize} onChange={e => setForm(f => ({ ...f, bainSize: e.target.value }))} style={{ ...inputStyle, width: "100px", fontSize: "12px" }} />
                    </div>

                    {/* Daman Style */}
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", display: "block", marginBottom: "4px", textTransform: "uppercase" }}>Daman Style</label>
                      <div style={{ display: "flex", gap: "12px" }}>
                        {["Kurta", "Sida Daman", "Gol Daman", "None"].map(opt => (
                          <label key={opt} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", cursor: "pointer" }}>
                            <input type="radio" name="damanStyle" value={opt} checked={form.damanStyle === opt} onChange={() => setForm(f => ({ ...f, damanStyle: opt }))} style={{ accentColor: "#2d6a4f" }} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Design + Suit */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px" }}>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", display: "block", marginBottom: "3px" }}>DESIGN BUTTON</label>
                      <input value={form.designButton} onChange={e => setForm(f => ({ ...f, designButton: e.target.value }))} style={{ ...inputStyle, fontSize: "12px" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", display: "block", marginBottom: "3px" }}>DESIGN SUIT</label>
                      <input value={form.designSuit} onChange={e => setForm(f => ({ ...f, designSuit: e.target.value }))} style={{ ...inputStyle, fontSize: "12px" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Type + Remarks */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
                <div>
                  <div style={sectionHeader}>👔 Garment Type</div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    {["Pajama", "Pant Shalwar", "Trouser", "Regular", "Balochi"].map(type => (
                      <label key={type} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                        <input type="radio" name="type" value={type.toLowerCase().replace(/\s+/g, "-")} checked={form.type === type.toLowerCase().replace(/\s+/g, "-")} onChange={() => setForm(f => ({ ...f, type: type.toLowerCase().replace(/\s+/g, "-") }))} style={{ accentColor: "#2d6a4f" }} />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={sectionHeader}>📝 Remarks</div>
                  <textarea value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} rows={3} placeholder="Special instructions..." style={{ ...inputStyle, resize: "vertical", width: "100%", fontFamily: "inherit" }} />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button onClick={resetForm} style={{ padding: "10px 24px", background: "#f0f4f8", border: "1px solid #d1d5db", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px", color: "#374151" }}>🔄 Reset</button>
                <button onClick={() => setView("orders")} style={{ padding: "10px 24px", background: "#f0f4f8", border: "1px solid #d1d5db", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px", color: "#374151" }}>✖ Close</button>
                <button onClick={handleSave} style={{ padding: "10px 28px", background: "linear-gradient(135deg, #1a3a2a, #2d6a4f)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "14px", boxShadow: "0 4px 12px rgba(45,106,79,0.4)" }}>💾 Save & Print</button>
              </div>
            </div>
          </div>
        )}

        {/* ─── ORDERS LIST ─── */}
        {view === "orders" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h2 style={{ color: "#1a3a2a", fontWeight: "800", fontSize: "22px" }}>All Orders</h2>
              <div style={{ display: "flex", gap: "10px" }}>
                <input placeholder="Search orders..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} style={{ ...inputStyle, width: "220px" }} />
                <button onClick={() => { resetForm(); setView("newOrder"); }} style={{ padding: "8px 18px", background: "linear-gradient(135deg, #1a3a2a, #2d6a4f)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>➕ New Order</button>
              </div>
            </div>
            <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg, #1a3a2a, #2d6a4f)" }}>
                    {["Booking #", "Customer", "Book Date", "Delivery Date", "Type", "Bain", "Daman", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#d4a017", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 && (
                    <tr><td colSpan={9} style={{ padding: "30px", textAlign: "center", color: "#9ca3af" }}>No orders found</td></tr>
                  )}
                  {filteredOrders.map((o, i) => (
                    <tr key={o.id} style={{ borderBottom: "1px solid #f0f4f8", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                      <td style={{ padding: "10px 14px", fontWeight: "700", color: "#2d6a4f" }}>{o.bookingNo}</td>
                      <td style={{ padding: "10px 14px", fontWeight: "600" }}>{o.customerName}</td>
                      <td style={{ padding: "10px 14px", color: "#6b7280", fontSize: "13px" }}>{o.bookDate}</td>
                      <td style={{ padding: "10px 14px", color: "#6b7280", fontSize: "13px" }}>{o.deliveryDate}</td>
                      <td style={{ padding: "10px 14px", textTransform: "capitalize", fontSize: "13px" }}>{o.type}</td>
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: "#6b7280" }}>{o.bainStyle || "—"}</td>
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: "#6b7280" }}>{o.damanStyle || "—"}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <select value={o.status} onChange={e => setOrders(prev => prev.map(ord => ord.id === o.id ? { ...ord, status: e.target.value } : ord))}
                          style={{ background: statusColor(o.status) + "22", color: statusColor(o.status), border: `1px solid ${statusColor(o.status)}44`, borderRadius: "6px", padding: "3px 8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                          {["pending", "in-progress", "delivered", "cancelled"].map(s => <option key={s} value={s} style={{ background: "white", color: "#374151" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => handleEdit(o)} style={{ background: "#dbeafe", color: "#1d4ed8", border: "none", borderRadius: "5px", padding: "4px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>✏️ Edit</button>
                          <button onClick={() => handleDelete(o.id)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "5px", padding: "4px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── CUSTOMERS ─── */}
        {view === "customers" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h2 style={{ color: "#1a3a2a", fontWeight: "800", fontSize: "22px" }}>Customers</h2>
              <button onClick={() => setAddingCustomer(true)} style={{ padding: "8px 18px", background: "linear-gradient(135deg, #1a3a2a, #2d6a4f)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>➕ Add Customer</button>
            </div>
            {addingCustomer && (
              <div style={{ background: "white", borderRadius: "12px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "2px solid #2d6a4f" }}>
                <h3 style={{ color: "#1a3a2a", fontWeight: "700", marginBottom: "12px" }}>New Customer</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
                  {[["Customer ID", "id"], ["Name", "name"], ["Phone", "phone"], ["Address", "address"]].map(([label, key]) => (
                    <div key={key}>
                      <label style={{ fontSize: "12px", fontWeight: "700", color: "#6b7280", display: "block", marginBottom: "4px" }}>{label}</label>
                      <input value={newCustomer[key]} onChange={e => setNewCustomer(c => ({ ...c, [key]: e.target.value }))} style={inputStyle} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <button onClick={handleAddCustomer} style={{ padding: "8px 18px", background: "#2d6a4f", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}>Save</button>
                  <button onClick={() => setAddingCustomer(false)} style={{ padding: "8px 18px", background: "#f0f4f8", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            )}
            <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg, #1a3a2a, #2d6a4f)" }}>
                    {["ID", "Name", "Phone", "Address", "Orders"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#d4a017", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => (
                    <tr key={c.id} style={{ borderBottom: "1px solid #f0f4f8", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                      <td style={{ padding: "12px 16px", fontWeight: "700", color: "#2d6a4f" }}>{c.id}</td>
                      <td style={{ padding: "12px 16px", fontWeight: "600" }}>{c.name}</td>
                      <td style={{ padding: "12px 16px", color: "#6b7280" }}>{c.phone}</td>
                      <td style={{ padding: "12px 16px", color: "#6b7280" }}>{c.address}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: "#f0fdf4", color: "#059669", padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                          {orders.filter(o => o.customerCode === c.id).length}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  border: "1px solid #d1d5db", borderRadius: "6px", padding: "7px 10px",
  fontSize: "13px", outline: "none", background: "white", width: "100%",
  boxSizing: "border-box", transition: "border-color 0.2s",
};

const labelStyle = {
  fontSize: "13px", fontWeight: "700", color: "#374151", whiteSpace: "nowrap", minWidth: "100px"
};

const sectionHeader = {
  background: "linear-gradient(135deg, #1a3a2a, #2d6a4f)", color: "#d4a017",
  padding: "8px 14px", borderRadius: "6px 6px 0 0", fontWeight: "700", fontSize: "13px",
  letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "0"
};
