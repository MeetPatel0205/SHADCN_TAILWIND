import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Signup04 } from "@/components/signup-04"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

export function EditCustomerPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { token } = useAuth()
    const [customer, setCustomer] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const authToken = token || localStorage.getItem('token');
                if (!authToken) {
                    toast.error("Not authenticated");
                    return;
                }

                const response = await fetch(`/api/customers/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch customer")
                }

                const data = await response.json()
                setCustomer(data)
            } catch (error) {
                toast.error("Error loading customer")
                navigate("/customers")
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            fetchCustomer()
        }
    }, [id, token, navigate])

    if (isLoading) {
        return <div className="p-8 text-center">Loading customer data...</div>
    }

    if (!customer) {
        return <div className="p-8 text-center">Customer not found</div>
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <Signup04 isInternal={true} initialData={customer} />
            </div>
        </div>
    )
}
