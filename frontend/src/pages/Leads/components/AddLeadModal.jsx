import { useMemo, useState } from "react"
import {
  X,
  UserRound,
  Building2,
  Globe,
  ClipboardList,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

const SUB_SOURCES = [
  "WhatsApp direct",
  "Instagram DM",
  "Call",
  "Referral",
  "Walk-in",
  "Event",
  "Other",
]

const SERVICE_LINES = ["CopperBrand", "CopperWeb", "CopperFlow"]
const EXISTING_ASSETS = ["Logo", "Website", "Social pages", "Brand guide", "None"]

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-stone-200 bg-white text-[12px] text-stone-700 outline-none placeholder:text-stone-400 focus:border-[#C69A7E] focus:ring-2 focus:ring-[#C69A7E]/10"

const labelClass =
  "block text-[10px] font-semibold text-stone-500 mb-1.5"

const normalizePhone = (value = "") => value.replace(/\D/g, "").slice(-10)
const normalizeEmail = (value = "") => value.trim().toLowerCase()
const normalizeUsername = (value = "") =>
  value.trim().toLowerCase().replace(/^@/, "").replace(/\/$/, "")
const normalizeLinkedIn = (value = "") => {
  const cleaned = value.trim().toLowerCase().replace(/\/$/, "")
  return cleaned.split("/in/").pop() || cleaned
}

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-2.5 mb-4">
      <div className="w-8 h-8 rounded-lg bg-[#F4EAE3] text-[#A96C4B] flex items-center justify-center shrink-0">
        <Icon size={15} />
      </div>
      <div>
        <h3 className="text-[12px] font-bold text-[#352B24]">{title}</h3>
        {description && <p className="text-[10px] text-stone-400 mt-0.5">{description}</p>}
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className={labelClass}>
        {label}{required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

function AddLeadModal({ onClose, onCreate, existingLeads = [] }) {
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    designation: "",
    phone: "",
    whatsappNumber: "",
    email: "",
    instagramUsername: "",
    linkedinUsername: "",
    website: "",
    city: "",
    state: "",
    subSource: "",
    requirementSummary: "",
    industry: "",
    companySize: "",
    expectedTimeline: "",
    serviceLines: [],
    existingAssets: [],
    notes: "",
  })
  const [error, setError] = useState("")
  const [duplicate, setDuplicate] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const update = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }))
    setError("")
    setDuplicate(null)
  }

  const toggleArrayValue = (key, value) => {
    setForm((previous) => {
      const current = previous[key]
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current.filter((item) => item !== "None"), value]
      return {
        ...previous,
        [key]: value === "None" ? (current.includes("None") ? [] : ["None"]) : next,
      }
    })
  }

  const duplicateMatch = useMemo(() => {
    const phone = normalizePhone(form.phone)
    const email = normalizeEmail(form.email)
    const instagram = normalizeUsername(form.instagramUsername)
    const linkedin = normalizeLinkedIn(form.linkedinUsername)

    if (!phone && !email && !instagram && !linkedin) return null

    return existingLeads.find((lead) => {
      const storedPhone = lead.phone || ""
      const storedEmail = lead.email || ""
      const phoneMatch = phone && storedPhone && !/[x*]/i.test(storedPhone) && normalizePhone(storedPhone) === phone
      const emailMatch = email && storedEmail && !/[x*]/i.test(storedEmail) && normalizeEmail(storedEmail) === email
      const instagramMatch = instagram && lead.instagramUsername && normalizeUsername(lead.instagramUsername) === instagram
      const linkedinMatch = linkedin && lead.linkedinUsername && normalizeLinkedIn(lead.linkedinUsername) === linkedin
      return Boolean(phoneMatch || emailMatch || instagramMatch || linkedinMatch)
    })
  }, [form.phone, form.email, form.instagramUsername, form.linkedinUsername, existingLeads])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setDuplicate(null)
    if (!form.fullName.trim()) return setError("Full name is required.")
    if (!form.phone.trim() && !form.email.trim() && !form.instagramUsername.trim()) return setError("Provide at least one: phone, email or Instagram username.")
    if (form.phone.trim() && normalizePhone(form.phone).length !== 10) return setError("Enter a valid 10-digit phone number.")
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError("Enter a valid email address.")

    const phone = normalizePhone(form.phone)
    const payload = {
      name: form.fullName.trim(), company: form.companyName.trim(), designation: form.designation.trim(),
      phone: phone ? `+91${phone}` : "", whatsappNumber: form.whatsappNumber.trim() || (phone ? `+91${phone}` : ""),
      email: normalizeEmail(form.email), instagramUsername: normalizeUsername(form.instagramUsername),
      linkedinUsername: normalizeLinkedIn(form.linkedinUsername), website: form.website.trim(), city: form.city.trim(), state: form.state.trim(),
      source: "Manual add", subSource: form.subSource, requirementSummary: form.requirementSummary.trim(), industry: form.industry.trim(),
      companySize: form.companySize, timeline: form.expectedTimeline, services: form.serviceLines, tags: form.existingAssets,
      notes: form.notes.trim(),
    }
    try {
      setSubmitting(true)
      await onCreate(payload)
      onClose()
    } catch (requestError) {
      setError(requestError.message || "Unable to create lead.")
      if (requestError.details?.duplicateLeadId) setDuplicate({ id: requestError.details.duplicateLeadId, name: "Existing matching lead" })
    } finally { setSubmitting(false) }
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#241C17]/40 backdrop-blur-[3px] flex items-center justify-center p-3 sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-[850px] max-h-[92vh] bg-[#FBFAF8] rounded-2xl shadow-2xl border border-white/70 overflow-hidden flex flex-col">
        <div className="px-5 sm:px-7 py-4 border-b border-stone-200/80 bg-white flex items-center justify-between shrink-0">
          <div>
            <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#A96C4B]">Leads management</p>
            <h2 className="text-[19px] font-bold text-[#352B24] mt-1">Add new lead</h2>
            <p className="text-[10px] text-stone-400 mt-1">Capture an enquiry and create its initial assignment activity.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close form" className="w-9 h-9 rounded-lg flex items-center justify-center text-stone-400 hover:bg-stone-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="p-5 sm:p-7 space-y-7">
            <section>
              <SectionHeading icon={UserRound} title="Contact information" description="Add the lead's identity and at least one contact method." />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name" required>
                  <input className={inputClass} placeholder="e.g. Rahul Sharma" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
                </Field>
                <Field label="Company name">
                  <input className={inputClass} placeholder="Company or business name" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} />
                </Field>
                <Field label="Designation">
                  <input className={inputClass} placeholder="e.g. Founder" value={form.designation} onChange={(e) => update("designation", e.target.value)} />
                </Field>
                <Field label="Phone number">
                  <input className={inputClass} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                </Field>
                <Field label="WhatsApp number">
                  <input className={inputClass} placeholder="Defaults to phone number" value={form.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)} />
                </Field>
                <Field label="Email address">
                  <input type="email" className={inputClass} placeholder="name@company.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
                </Field>
                <Field label="Instagram username">
                  <input className={inputClass} placeholder="@username" value={form.instagramUsername} onChange={(e) => update("instagramUsername", e.target.value)} />
                </Field>
                <Field label="LinkedIn username / profile">
                  <input className={inputClass} placeholder="linkedin.com/in/username" value={form.linkedinUsername} onChange={(e) => update("linkedinUsername", e.target.value)} />
                </Field>
                <Field label="Website">
                  <input className={inputClass} placeholder="https://example.com" value={form.website} onChange={(e) => update("website", e.target.value)} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="City">
                    <input className={inputClass} placeholder="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
                  </Field>
                  <Field label="State">
                    <input className={inputClass} placeholder="State" value={form.state} onChange={(e) => update("state", e.target.value)} />
                  </Field>
                </div>
              </div>
              <p className="text-[9px] text-stone-400 mt-3">* At least one of phone, email or Instagram username is required.</p>
            </section>

            <div className="h-px bg-stone-200/70" />

            <section>
              <SectionHeading icon={Globe} title="Source and tracking" description="Record where this enquiry originated." />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Lead source">
                  <input className={`${inputClass} bg-stone-100 text-stone-500`} value="Manual" readOnly />
                </Field>
                <Field label="Sub-source">
                  <select className={inputClass} value={form.subSource} onChange={(e) => update("subSource", e.target.value)}>
                    <option value="">Select sub-source</option>
                    {SUB_SOURCES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>
              </div>
            </section>

            <div className="h-px bg-stone-200/70" />

            <section>
              <SectionHeading icon={Building2} title="Requirement details" description="Service lines are required before the lead moves to Meeting scheduled." />
              <Field label="Service lines">
                <div className="flex flex-wrap gap-2">
                  {SERVICE_LINES.map((service) => {
                    const selected = form.serviceLines.includes(service)
                    return (
                      <button key={service} type="button" onClick={() => toggleArrayValue("serviceLines", service)} className={`px-3 py-2 rounded-lg border text-[10px] font-semibold transition-colors ${selected ? "bg-[#F4EAE3] border-[#C69A7E] text-[#925B3E]" : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"}`}>
                        {selected ? "✓ " : "+ "}{service}
                      </button>
                    )
                  })}
                </div>
              </Field>
              <div className="mt-4">
                <Field label="Requirement summary">
                  <textarea rows={3} className="w-full p-3 rounded-lg border border-stone-200 bg-white text-[12px] text-stone-700 outline-none resize-y placeholder:text-stone-400 focus:border-[#C69A7E]" placeholder="Briefly describe the prospect's requirement..." value={form.requirementSummary} onChange={(e) => update("requirementSummary", e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <Field label="Industry">
                  <input className={inputClass} placeholder="e.g. Retail" value={form.industry} onChange={(e) => update("industry", e.target.value)} />
                </Field>
                <Field label="Company size">
                  <select className={inputClass} value={form.companySize} onChange={(e) => update("companySize", e.target.value)}>
                    <option value="">Select size</option>
                    <option>Individual</option><option>1–10 employees</option><option>11–50 employees</option><option>51–200 employees</option><option>201–500 employees</option><option>500+ employees</option>
                  </select>
                </Field>
                <Field label="Expected timeline">
                  <select className={inputClass} value={form.expectedTimeline} onChange={(e) => update("expectedTimeline", e.target.value)}>
                    <option value="">Select timeline</option>
                    <option>Immediately</option><option>Within 1 month</option><option>1–3 months</option><option>3–6 months</option><option>More than 6 months</option><option>Not decided</option>
                  </select>
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Existing assets">
                  <div className="flex flex-wrap gap-2">
                    {EXISTING_ASSETS.map((asset) => {
                      const selected = form.existingAssets.includes(asset)
                      return (
                        <button key={asset} type="button" onClick={() => toggleArrayValue("existingAssets", asset)} className={`px-3 py-2 rounded-lg border text-[10px] font-medium ${selected ? "bg-[#F4EAE3] border-[#C69A7E] text-[#925B3E]" : "bg-white border-stone-200 text-stone-500"}`}>
                          {selected ? "✓ " : ""}{asset}
                        </button>
                      )
                    })}
                  </div>
                </Field>
              </div>
            </section>

            <div className="h-px bg-stone-200/70" />

            <section>
              <SectionHeading icon={FileText} title="Internal notes" description="Private screening remarks. Record budget information here; budget is not a separate lead field." />
              <textarea rows={3} className="w-full p-3 rounded-lg border border-stone-200 bg-white text-[12px] text-stone-700 outline-none resize-y placeholder:text-stone-400 focus:border-[#C69A7E]" placeholder="Add screening notes, budget, context or other relevant details..." value={form.notes} onChange={(e) => update("notes", e.target.value)} />
            </section>

            <div className="h-px bg-stone-200/70" />

            <section>
              <SectionHeading icon={ClipboardList} title="Initial activity" description="The system creates the mandatory first task for every new open lead." />
              <div className="rounded-lg border border-[#E9D8CA] bg-[#F8F1EC] p-3 flex gap-2.5">
                <AlertCircle size={15} className="text-[#A96C4B] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-[#805239]">Assign owner · Due in 30 minutes</p>
                  <p className="text-[10px] text-[#98745E] mt-1 leading-relaxed">This lead will enter the Unassigned queue. The Assigner of the day receives the assignment task. Once assigned, it is replaced with Make first contact, due at the lead's first-response deadline.</p>
                </div>
              </div>
            </section>

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-[11px] text-rose-700">
                <div className="flex items-center gap-2 font-semibold"><AlertCircle size={14} />{error}</div>
                {duplicate && <p className="mt-2">Existing record: {duplicate.id} · {duplicate.name || duplicate.company}</p>}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white border-t border-stone-200 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
            <p className="text-[9px] text-stone-400">* Required fields</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="h-9 px-4 rounded-lg border border-stone-200 text-[11px] font-semibold text-stone-600 hover:bg-stone-50">Cancel</button>
              <button type="submit" disabled={submitting} className="h-9 px-4 rounded-lg bg-[#A96C4B] text-white text-[11px] font-semibold flex items-center gap-2 hover:bg-[#925B3E] transition-colors disabled:opacity-60">
                <CheckCircle2 size={14} />{submitting ? "Creating…" : "Create lead"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLeadModal
