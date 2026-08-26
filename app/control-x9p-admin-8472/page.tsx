import AdminLogin from "../../components/AdminLogin";

export default function AdminLoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        backgroundColor: "#F7FBF8",
        boxSizing: "border-box",
      }}
    >
      <AdminLogin />
    </main>
  );
}
