"use client";

import { Edit2Icon } from "lucide-react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { ErrorMessage, Formik } from "formik";
import { ZodError, z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { PulseLoading } from "../pulse-loading";
import { useToast } from "../ui/use-toast";

interface IEditProfile {
    fullname: string;
    github: string | null;
    twitter: string | null;
    updateUserData: (
        fullname: string,
        github: string,
        twitter: string
    ) => Promise<boolean>;
}

export const DialogProfile: React.FC<IEditProfile> = ({
    fullname,
    github,
    twitter,
    updateUserData,
}) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const { toast } = useToast();

    const ValidationSchema = z.object({
        fullname: z
            .string()
            .min(3, "Fullname is too short")
            .max(20, "Fullname is too long"),
        github: z
            .string()
            .regex(
                /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i,
                "Wrong github username"
            )
            .min(3, "Username is too short")
            .max(20, "Username is too long")
            .optional()
            .or(z.literal("")),
        twitter: z
            .string()
            .regex(/^[a-zA-Z0-9_]{1,15}$/, "Wrong twitter username")
            .optional()
            .or(z.literal("")),
    });

    type FormValues = z.infer<typeof ValidationSchema>;
    const validateForm = (values: FormValues) => {
        try {
            ValidationSchema.parse(values);
        } catch (error) {
            if (error instanceof ZodError) {
                return error.formErrors.fieldErrors;
            }
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-7 w-7">
                    <Edit2Icon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[450px] max-w-full">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <Formik
                        initialValues={{
                            fullname: fullname,
                            github: github ?? "",
                            twitter: twitter ?? "",
                        }}
                        validate={validateForm}
                        onSubmit={async (values) => {
                            setLoading(true);
                            const res = await updateUserData(
                                values.fullname,
                                values.github,
                                values.twitter
                            );
                            if (res) {
                                toast({
                                    title: "Profile Updated!",
                                    description:
                                        "Your changes have been saved successfully.",
                                });
                                setOpen(false);
                            } else {
                                toast({
                                    title: "Uh oh, Saving Failed!",
                                    description:
                                        "We encountered an issue saving your profile. Please try again later.",
                                    variant: "destructive",
                                });
                            }
                            setLoading(false);
                        }}
                    >
                        {({
                            values,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                        }) => (
                            <form
                                className="space-y-4 pt-4"
                                onSubmit={handleSubmit}
                            >
                                <div className="grid w-full items-center gap-1.5">
                                    <Label
                                        htmlFor="username"
                                        className="text-muted-foreground"
                                    >
                                        Username
                                    </Label>
                                    <Input
                                        type="text"
                                        id="username"
                                        name="username"
                                        placeholder="username"
                                        value="akbaridria"
                                        disabled={true}
                                    />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label
                                        htmlFor="email"
                                        className="text-muted-foreground"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Email"
                                        value="akbaridria15@gmail.com"
                                        disabled={true}
                                    />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="fullname">Full Name</Label>
                                    <Input
                                        type="text"
                                        id="fullname"
                                        name="fullname"
                                        placeholder="Your full name"
                                        value={values.fullname}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={loading}
                                    />
                                    <ErrorMessage
                                        name="fullname"
                                        component="div"
                                        className="text-sm text-red-600"
                                    />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="github">
                                        Github username
                                    </Label>
                                    <Input
                                        type="text"
                                        id="github"
                                        name="github"
                                        placeholder="Your github username"
                                        value={values.github}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={loading}
                                    />
                                    <ErrorMessage
                                        name="github"
                                        component="div"
                                        className="text-sm text-red-600"
                                    />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="twitter">
                                        Twitter username
                                    </Label>
                                    <Input
                                        type="text"
                                        id="twitter"
                                        name="twitter"
                                        placeholder="Your twitter username"
                                        value={values.twitter}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={loading}
                                    />
                                    <ErrorMessage
                                        name="twitter"
                                        component="div"
                                        className="text-sm text-red-600"
                                    />
                                </div>
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="w-full gap-2"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading && <PulseLoading />}
                                    Update Profile
                                </Button>
                            </form>
                        )}
                    </Formik>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
