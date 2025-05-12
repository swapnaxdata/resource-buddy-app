
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import Upload from "@/pages/Upload";
import MyNotes from "@/pages/MyNotes";
import NoteDetail from "@/pages/NoteDetail";
import NotFound from "@/pages/NotFound";
import Confirm from "@/pages/Confirm";
import ResetPassword from "@/pages/ResetPassword";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
	<BrowserRouter>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<TooltipProvider>
					<Toaster />
					<Routes>
						<Route path="/" element={<Index />} />
						<Route path="/login" element={<Login />} />
						<Route path="/admin" element={<Admin />} />
						<Route path="/upload" element={<Upload />} />
						<Route path="/my-notes" element={<MyNotes />} />
						<Route path="/note/:id" element={<NoteDetail />} />
						<Route path="/confirm" element={<Confirm />} />
						<Route path="/about" element={<About />} />
						<Route path="/reset-password" element={<ResetPassword />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</TooltipProvider>
			</AuthProvider>
		</QueryClientProvider>
	</BrowserRouter>
);

export default App;
