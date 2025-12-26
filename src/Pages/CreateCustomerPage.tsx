import { Signup04 } from "@/components/signup-04"

export function CreateCustomerPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <Signup04 isInternal={true} />
            </div>
        </div>
    )
}
