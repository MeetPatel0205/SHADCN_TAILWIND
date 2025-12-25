"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { IconBrandGoogle, IconBrandGithub } from "@tabler/icons-react"

export function Signup04({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile: "",
        dob: "",
        gender: "",
        city: "",
        state: "",
        pincode: "",
        fullAddress: "",
        avatar: "" // Optional placeholder
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, gender: value })
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch("/api/auth/customer/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    role: "customer"
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong")
            }

            login(data.token, data.user)
            toast.success("Customer account created successfully")
            navigate("/customer/dashboard")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={onSubmit} className="p-6 md:p-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Create your account</h1>
                                <p className="text-balance text-muted-foreground">
                                    Sign up for the Customer Portal
                                </p>
                            </div>

                            {/* Personal Info */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" required placeholder="John Doe" value={formData.name} onChange={handleChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" required placeholder="johndoe" value={formData.username} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" required placeholder="m@example.com" value={formData.email} onChange={handleChange} />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="mobile">Mobile Number</Label>
                                    <Input id="mobile" type="tel" required placeholder="1234567890" value={formData.mobile} onChange={handleChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" type="date" required value={formData.dob} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select onValueChange={handleSelectChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="pincode">Pincode</Label>
                                    <Input id="pincode" required placeholder="ZIP Code" value={formData.pincode} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" required placeholder="New York" value={formData.city} onChange={handleChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input id="state" required placeholder="NY" value={formData.state} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="fullAddress">Full Address</Label>
                                <Textarea id="fullAddress" required placeholder="123 Main St, Apt 4B" value={formData.fullAddress} onChange={handleChange} />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" required value={formData.password} onChange={handleChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input id="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="avatar">Profile Picture URL (Optional)</Label>
                                <Input id="avatar" placeholder="https://example.com/avatar.jpg" value={formData.avatar} onChange={handleChange} />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating Account..." : "Sign Up"}
                            </Button>

                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="w-full" type="button">
                                    <IconBrandGithub className="h-4 w-4 mr-2" /> GitHub
                                </Button>
                                <Button variant="outline" className="w-full" type="button">
                                    <IconBrandGoogle className="h-4 w-4 mr-2" /> Google
                                </Button>
                            </div>

                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link to="/customer/login" className="underline underline-offset-4">
                                    Log in
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="relative hidden bg-muted md:block">
                        <img
                            src="/PMTECH.png"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
