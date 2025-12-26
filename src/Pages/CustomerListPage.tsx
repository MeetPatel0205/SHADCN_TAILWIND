import { useEffect, useState } from "react"
import { CustomerTable } from "@/components/customer-table"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export function CustomerListPage() {
    const navigate = useNavigate()
    const [customers, setCustomers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { token } = useAuth()

    const fetchCustomers = async () => {
        try {
            const response = await fetch("/api/customers", {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!response.ok) throw new Error("Failed to fetch customers")
            const data = await response.json()
            setCustomers(data)
        } catch (error) {
            toast.error("Failed to load customers")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (token) {
            fetchCustomers()
        } else {
            // Check if we should wait for token (e.g., initial load) or if user is just not logged in.
            // For now, if no token found after a short delay (or if simple check), stop loading.
            // Since AuthContext loads token in useEffect, it might be null initially.
            // Let's rely on isAuthenticated or handle null token gracefully.
            const timer = setTimeout(() => {
                if (!token) setIsLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [token])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this customer?")) return

        try {
            const response = await fetch(`/api/customers/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!response.ok) throw new Error("Failed to delete")

            toast.success("Customer deleted")
            fetchCustomers() // Refresh list
        } catch (error) {
            toast.error("Error deleting customer")
        }
    }



    const handleEdit = (customer: any) => {
        navigate(`/customers/${customer._id}/edit`)
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
                <Button asChild>
                    <Link to="/create-customer">
                        <Plus className="mr-2 h-4 w-4" /> Add Customer
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Customers</CardTitle>
                    <CardDescription>
                        Manage your customer base here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <p>Loading...</p> : (
                        <CustomerTable
                            customers={customers}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
