"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-context";
import {
  apiRegistrationCreate,
  type RegistrationPersonalInfo,
  type RegistrationCategory,
  type AcademicQualification,
  type ProfessionalQualification,
} from "@/lib/api";

const STEPS = [
  "Personal Information",
  "Category of Registration",
  "Academic Qualifications",
  "Professional Qualifications",
  "Review & Submit",
];

const PROFESSIONS = [
  "Architect",
  "Civil Engineer",
  "Mechanical Engineer",
  "Electrical Engineer",
  "Structural Engineer",
  "Other",
];

const LEVELS = ["Graduate", "Professional", "Consultant", "Specialist"];

const defaultPersonal: RegistrationPersonalInfo = {
  firstName: "",
  middleName: "",
  thirdName: "",
  fourthName: "",
  nationality: "",
  placeOfBirth: "",
  dateOfBirth: "",
  mailingAddress: "",
  email: "",
  telephone: "",
};

const defaultCategory: RegistrationCategory = {
  profession: "",
  level: "",
};

export default function ProfessionalRegisterPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [step, setStep] = useState(0);
  const [personal, setPersonal] = useState<RegistrationPersonalInfo>(defaultPersonal);
  const [category, setCategory] = useState<RegistrationCategory>(defaultCategory);
  const [academic, setAcademic] = useState<AcademicQualification[]>([
    { qualificationType: "", institution: "", specialization: "", dateOfAward: "" },
  ]);
  const [professional, setProfessional] = useState<ProfessionalQualification[]>([
    { qualificationType: "", institution: "", dateOfAward: "" },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addAcademic = () =>
    setAcademic((prev) => [...prev, { qualificationType: "", institution: "", specialization: "", dateOfAward: "" }]);
  const removeAcademic = (i: number) =>
    setAcademic((prev) => prev.filter((_, idx) => idx !== i));
  const updateAcademic = (i: number, field: keyof AcademicQualification, value: string) =>
    setAcademic((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });

  const addProfessional = () =>
    setProfessional((prev) => [...prev, { qualificationType: "", institution: "", dateOfAward: "" }]);
  const removeProfessional = (i: number) =>
    setProfessional((prev) => prev.filter((_, idx) => idx !== i));
  const updateProfessional = (i: number, field: keyof ProfessionalQualification, value: string) =>
    setProfessional((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });

  const handleSubmit = async () => {
    if (!token) {
      setError("You must be signed in to submit.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await apiRegistrationCreate(token, {
        personalInfo: {
          ...personal,
          dateOfBirth: personal.dateOfBirth || new Date().toISOString().slice(0, 10),
        },
        category,
        academicQualifications: academic
          .filter((a) => a.qualificationType && a.institution && a.specialization && a.dateOfAward)
          .map((a) => ({ ...a, dateOfAward: a.dateOfAward })),
        professionalQualifications: professional
          .filter((p) => p.qualificationType && p.institution && p.dateOfAward)
          .map((p) => ({ ...p, dateOfAward: p.dateOfAward })),
      });
      router.replace("/professional/dashboard?registered=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">ECOSS Registration Application</h2>
        <p className="text-sm text-muted-foreground">
          Republic of South Sudan · Ministry of Cabinet Affairs · Engineering Council of South Sudan (ECOSS) · ECOSS – FORM 1
        </p>
      </div>

      <div className="flex gap-2 border-b border-border pb-2">
        {STEPS.map((label, i) => (
          <Button
            key={label}
            variant={step === i ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setStep(i)}
          >
            {i + 1}. {label.split(" ")[0]}
          </Button>
        ))}
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>{STEPS[step]}</CardTitle>
          <CardDescription>
            {step === 0 && "Enter your personal details."}
            {step === 1 && "Select your profession and level."}
            {step === 2 && "Add academic qualifications. At least one required."}
            {step === 3 && "Add professional qualifications."}
            {step === 4 && "Review and submit your application."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={personal.firstName} onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Middle Name</Label>
                <Input value={personal.middleName ?? ""} onChange={(e) => setPersonal({ ...personal, middleName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Third Name</Label>
                <Input value={personal.thirdName ?? ""} onChange={(e) => setPersonal({ ...personal, thirdName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Fourth Name</Label>
                <Input value={personal.fourthName ?? ""} onChange={(e) => setPersonal({ ...personal, fourthName: e.target.value })} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Nationality</Label>
                <Input value={personal.nationality} onChange={(e) => setPersonal({ ...personal, nationality: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Place of Birth</Label>
                <Input value={personal.placeOfBirth} onChange={(e) => setPersonal({ ...personal, placeOfBirth: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" value={personal.dateOfBirth} onChange={(e) => setPersonal({ ...personal, dateOfBirth: e.target.value })} required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Mailing Address</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={personal.mailingAddress}
                  onChange={(e) => setPersonal({ ...personal, mailingAddress: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Telephone</Label>
                <Input type="tel" value={personal.telephone} onChange={(e) => setPersonal({ ...personal, telephone: e.target.value })} required />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Register me in Category</Label>
                <Select value={category.profession} onValueChange={(v) => setCategory({ ...category, profession: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select profession" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFESSIONS.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {category.profession === "Other" && (
                <div className="space-y-2">
                  <Label>Other (specify)</Label>
                  <Input
                    value={category.otherProfession ?? ""}
                    onChange={(e) => setCategory({ ...category, otherProfession: e.target.value })}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Level</Label>
                <Select value={category.level} onValueChange={(v) => setCategory({ ...category, level: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type (e.g. BSc, MSc)</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Date of Award</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {academic.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Input
                          value={row.qualificationType}
                          onChange={(e) => updateAcademic(i, "qualificationType", e.target.value)}
                          placeholder="BSc, MSc, PhD"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.institution}
                          onChange={(e) => updateAcademic(i, "institution", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.specialization}
                          onChange={(e) => updateAcademic(i, "specialization", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={row.dateOfAward}
                          onChange={(e) => updateAcademic(i, "dateOfAward", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeAcademic(i)}>Remove</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button type="button" variant="outline" size="sm" onClick={addAcademic}>Add row</Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Institution / Society</TableHead>
                    <TableHead>Date of Award</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {professional.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Input
                          value={row.qualificationType}
                          onChange={(e) => updateProfessional(i, "qualificationType", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.institution}
                          onChange={(e) => updateProfessional(i, "institution", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={row.dateOfAward}
                          onChange={(e) => updateProfessional(i, "dateOfAward", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeProfessional(i)}>Remove</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button type="button" variant="outline" size="sm" onClick={addProfessional}>Add row</Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-sm">
              <div>
                <span className="font-medium">Personal:</span> {personal.firstName} {personal.middleName} {personal.thirdName} {personal.fourthName} · {personal.nationality} · {personal.email} · {personal.telephone}
              </div>
              <div>
                <span className="font-medium">Category:</span> {category.profession} {category.otherProfession && `(${category.otherProfession})`} · {category.level}
              </div>
              <div>
                <span className="font-medium">Academic:</span> {academic.filter((a) => a.qualificationType || a.institution).length} entries
              </div>
              <div>
                <span className="font-medium">Professional:</span> {professional.filter((p) => p.qualificationType || p.institution).length} entries
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)}>Next</Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting…" : "Submit application"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/professional/dashboard" className="text-primary underline-offset-4 hover:underline">
          ← Back to dashboard
        </Link>
      </p>
    </div>
  );
}
