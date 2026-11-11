import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Plus,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  MoreHorizontal,
  AlertTriangle,
  UserRound,
  CalendarDays,
  Building2,
  ChevronDown,
  ChevronRight,
  Flame,
  Users,
  TrendingUp,
  X,
} from "lucide-react"
import AddLeadModal from "./components/AddLeadModal"
import { leadsApi } from "../../services/leadsApi"

const initialLeads = [
  {
    id: "CS-LD-00001", name: "Rahul Sharma", company: "Vertex Technologies",
    email: "ra****@gmail.com", phone: "98XXX12XXX", source: "Website form",
    stage: "New", priority: "High", confidence: null, value: 85000,
    services: ["CopperWeb", "CopperBrand"], owner: "Aarav Mehta",
    nextStep: "Initial discovery call", due: "Today, 2:30 PM", sla: "At risk",
    age: 1, initials: "RS", avatar: "bg-[#EADFD5] text-[#875438]",
  },
  {
    id: "CS-LD-00002", name: "Priya Desai", company: "Bloom & Co.",
    email: "pr****@outlook.com", phone: "99XXX45XXX", source: "Instagram DM",
    stage: "New", priority: "Medium", confidence: null, value: 45000,
    services: ["CopperBrand"], owner: null, nextStep: "Assign owner",
    due: "Today, 3:00 PM", sla: "Pending", age: 0, initials: "PD",
    avatar: "bg-[#E8E5F0] text-[#74618D]",
  },
  {
    id: "CS-LD-00003", name: "Karan Patel", company: "Nexa Solutions",
    email: "ka****@gmail.com", phone: "97XXX89XXX", source: "Referral",
    stage: "Contacted", priority: "High", confidence: null, value: 120000,
    services: ["CopperWeb", "CopperFlow"], owner: "Aarav Mehta",
    nextStep: "Follow-up on requirements", due: "Tomorrow, 11:00 AM",
    sla: "Met", age: 3, initials: "KP", avatar: "bg-[#DDE9E4] text-[#426B58]",
  },
  {
    id: "CS-LD-00004", name: "Ananya Rao", company: "Studio Aesthetic",
    email: "an****@gmail.com", phone: "96XXX21XXX", source: "Meta Lead Ad",
    stage: "Contacted", priority: "Medium", confidence: null, value: 65000,
    services: ["CopperBrand", "CopperWeb"], owner: "Riya Shah",
    nextStep: "Schedule a meeting", due: "Today, 5:00 PM", sla: "Met",
    age: 5, initials: "AR", avatar: "bg-[#F1E2E2] text-[#A45E5E]",
  },
  {
    id: "CS-LD-00005", name: "Vikram Nair", company: "Nair Enterprises",
    email: "vi****@gmail.com", phone: "98XXX67XXX", source: "Google Ads form",
    stage: "Meeting scheduled", priority: "High", confidence: 75, value: 180000,
    services: ["CopperWeb", "CopperFlow"], owner: "Riya Shah",
    nextStep: "Attend discovery meeting", due: "Nov 12, 11:30 AM",
    sla: "Met", age: 8, initials: "VN", avatar: "bg-[#E6E4D7] text-[#777044]",
  },
  {
    id: "CS-LD-00006", name: "Sneha Kulkarni", company: "PixelCraft Studio",
    email: "sn****@gmail.com", phone: "99XXX34XXX", source: "Website form",
    stage: "Meeting scheduled", priority: "Medium", confidence: 50, value: 95000,
    services: ["CopperBrand"], owner: "Aarav Mehta",
    nextStep: "Attend project discussion", due: "Nov 13, 3:00 PM",
    sla: "Met", age: 12, initials: "SK", avatar: "bg-[#E7E1ED] text-[#775D91]",
  },
  {
    id: "CS-LD-00007", name: "Arjun Malhotra", company: "Malhotra Retail",
    email: "ar****@gmail.com", phone: "97XXX56XXX", source: "Referral",
    stage: "Proposal sent", priority: "Super High", confidence: 95,
    value: 250000, services: ["CopperWeb", "CopperFlow"], owner: "Riya Shah",
    nextStep: "Follow up on proposal", due: "Today, 4:00 PM", sla: "Met",
    age: 18, initials: "AM", avatar: "bg-[#E8DDD5] text-[#895C42]",
  },
  {
    id: "CS-LD-00008", name: "Meera Joshi", company: "Meera Living",
    email: "me****@outlook.com", phone: "98XXX78XXX", source: "Meta Lead Ad",
    stage: "Proposal sent", priority: "High", confidence: 75, value: 145000,
    services: ["CopperBrand", "CopperWeb"], owner: "Aarav Mehta",
    nextStep: "Client proposal review", due: "Nov 11, 12:00 PM", sla: "Met",
    age: 24, initials: "MJ", avatar: "bg-[#E3E8DC] text-[#61744F]",
  },
  {
    id: "CS-LD-00009", name: "Dev Shah", company: "Shah Consulting",
    source: "Website form", stage: "Won", priority: "High", value: 110000,
    owner: "Riya Shah", services: ["CopperWeb"], initials: "DS", age: 10,
  },
  {
    id: "CS-LD-00010", name: "Neha Kapoor", company: "NK Designs",
    source: "Referral", stage: "Lost", priority: "Medium", value: 50000,
    owner: "Aarav Mehta", services: ["CopperBrand"], initials: "NK", age: 15,
  },
]

const openStages = [
  { name: "New", color: "bg-slate-400" },
  { name: "Contacted", color: "bg-blue-500" },
  { name: "Meeting scheduled", color: "bg-violet-500" },
  { name: "Proposal sent", color: "bg-[#C28B55]" },
]
const closedStages = ["Won", "Lost", "Unqualified"]

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0)

function Leads() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState("")

  const loadLeads = async () => {
    try { setApiError(""); const result = await leadsApi.list({ limit: 100 }); setLeads(result.data); }
    catch (error) { setApiError(error.message || "Unable to load leads. Check that the backend is running."); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadLeads(); }, [])
  const [showAddLead, setShowAddLead] = useState(false)
  const [view, setView] = useState("kanban")
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState("All stages")
  const [sourceFilter, setSourceFilter] = useState("All sources")
  const [priorityFilter, setPriorityFilter] = useState("All priorities")
  const [showFilters, setShowFilters] = useState(false)
  const [closedExpanded, setClosedExpanded] = useState(false)

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const term = search.toLowerCase().trim()
      const matchesSearch = !term ||
        lead.id.toLowerCase().includes(term) ||
        lead.name.toLowerCase().includes(term) ||
        lead.company.toLowerCase().includes(term)
      const matchesStage = stageFilter === "All stages" || lead.stage === stageFilter
      const matchesSource = sourceFilter === "All sources" || lead.source === sourceFilter
      const matchesPriority = priorityFilter === "All priorities" || lead.priority === priorityFilter
      return matchesSearch && matchesStage && matchesSource && matchesPriority
    })
  }, [leads, search, stageFilter, sourceFilter, priorityFilter])

  const openLeads = leads.filter((lead) => !closedStages.includes(lead.stage))
  const totalPipeline = openLeads.reduce((sum, lead) => sum + (lead.value || 0), 0)
  const unassignedCount = openLeads.filter((lead) => !lead.owner).length
  const atRiskCount = openLeads.filter((lead) => lead.sla === "At risk" || lead.sla === "Lapsed").length

  const handleCreateLead = async (payload) => {
    const result = await leadsApi.create(payload)
    setLeads((previous) => [result.data, ...previous.filter((lead) => lead.id !== result.data.id)])
    return result.data
  }

  const resetFilters = () => {
    setSearch("")
    setStageFilter("All stages")
    setSourceFilter("All sources")
    setPriorityFilter("All priorities")
  }

  return (
    <div className="min-h-full space-y-7 pb-8">
      {/* PAGE HEADER */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold tracking-[0.16em] text-[#A96C4B] uppercase">Workspace</span>
            <span className="text-stone-300">/</span>
            <span className="text-[10px] text-stone-400">Sales management</span>
          </div>
          <h1 className="text-[27px] font-bold tracking-tight text-[#352B24]">Leads</h1>
          <p className="text-[12px] text-stone-500 mt-1">Track enquiries, manage relationships and move opportunities forward.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button type="button" onClick={() => { setStageFilter("All stages"); setSearch(""); setShowFilters(true) }} className="h-10 px-4 rounded-xl border border-stone-200 bg-white text-stone-600 text-[11px] font-semibold flex items-center gap-2 hover:bg-stone-50 transition-colors">
            <Users size={15} />Unassigned
            {unassignedCount > 0 && <span className="bg-rose-50 text-rose-600 rounded-md px-1.5 py-0.5 text-[10px]">{unassignedCount}</span>}
          </button>
          <button type="button" onClick={() => setShowAddLead(true)} className="h-10 px-4 rounded-xl bg-[#A96C4B] text-white text-[11px] font-semibold flex items-center gap-2 shadow-[0_4px_12px_rgba(169,108,75,0.18)] hover:bg-[#925B3E] transition-colors">
            <Plus size={16} />Add lead
          </button>
        </div>
      </section>

      {/* SUMMARY CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard title="Total open leads" value={openLeads.length} description="Currently active opportunities" icon={Users} accent="copper" />
        <SummaryCard title="Pipeline value" value={formatCurrency(totalPipeline)} description="Unweighted expected deal value" icon={TrendingUp} accent="green" />
        <SummaryCard title="Unassigned leads" value={unassignedCount} description="Awaiting ownership assignment" icon={UserRound} accent="amber" />
        <SummaryCard title="SLA attention" value={atRiskCount} description="At risk or lapsed first responses" icon={AlertTriangle} accent="red" />
      </section>

      {apiError && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[11px] text-rose-700">{apiError} <button type="button" onClick={loadLeads} className="ml-2 font-bold underline">Retry</button></div>}

      {/* PIPELINE */}
      <section className="rounded-2xl border border-stone-200/80 bg-white shadow-[0_3px_15px_rgba(60,45,30,0.025)]">
        <div className="p-4 sm:p-5 border-b border-stone-100">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div>
              <h2 className="text-[15px] font-bold text-[#352B24]">Sales pipeline</h2>
              <p className="text-[11px] text-stone-400 mt-1">{filteredLeads.length} leads matching your selection</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="h-9 w-full sm:w-[230px] flex items-center gap-2.5 px-3 rounded-lg border border-stone-200 bg-[#FAF9F7] focus-within:border-[#C69A7E] transition-colors">
                <Search size={15} className="text-stone-400 shrink-0" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search leads..." className="w-full bg-transparent outline-none text-[11px] text-stone-700 placeholder:text-stone-400" />
                {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><X size={13} className="text-stone-400" /></button>}
              </div>

              <button type="button" onClick={() => setShowFilters(!showFilters)} className={`h-9 px-3 rounded-lg border flex items-center gap-2 text-[11px] font-medium transition-colors ${showFilters ? "border-[#C69A7E] bg-[#F8F1EC] text-[#985F40]" : "border-stone-200 text-stone-600 hover:bg-stone-50"}`}>
                <SlidersHorizontal size={14} />Filters
                <ChevronDown size={13} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>

              <div className="h-9 p-1 rounded-lg border border-stone-200 bg-[#FAF9F7] flex items-center">
                <button type="button" onClick={() => setView("kanban")} title="Kanban view" aria-pressed={view === "kanban"} className={`h-7 w-8 flex items-center justify-center rounded-md transition-colors ${view === "kanban" ? "bg-white text-[#A96C4B] shadow-sm" : "text-stone-400 hover:text-stone-600"}`}><LayoutGrid size={15} /></button>
                <button type="button" onClick={() => setView("list")} title="List view" aria-pressed={view === "list"} className={`h-7 w-8 flex items-center justify-center rounded-md transition-colors ${view === "list" ? "bg-white text-[#A96C4B] shadow-sm" : "text-stone-400 hover:text-stone-600"}`}><List size={16} /></button>
              </div>
              <button type="button" title="More options" className="h-9 w-9 rounded-lg border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50"><MoreHorizontal size={17} /></button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-end gap-3">
              <FilterSelect label="Stage" value={stageFilter} onChange={setStageFilter} options={["All stages", "New", "Contacted", "Meeting scheduled", "Proposal sent", "Won", "Lost", "Unqualified"]} />
              <FilterSelect label="Source" value={sourceFilter} onChange={setSourceFilter} options={["All sources", "Manual", "CSV import", "Website form", "Meta Lead Ad", "CTWA ad", "Google Ads form", "Instagram DM", "Referral"]} />
              <FilterSelect label="Priority" value={priorityFilter} onChange={setPriorityFilter} options={["All priorities", "Low", "Medium", "High", "Super High"]} />
              <button type="button" onClick={resetFilters} className="h-9 px-3 text-[11px] font-semibold text-[#A96C4B] hover:bg-[#F8F1EC] rounded-lg">Clear filters</button>
            </div>
          )}
        </div>

        {loading ? <div className="p-12 text-center text-[12px] text-stone-400">Loading leads from Copper OS…</div> : view === "kanban" && (
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
              {openStages.map((stage) => {
                const stageLeads = filteredLeads.filter((lead) => lead.stage === stage.name)
                const stageValue = stageLeads.reduce((sum, lead) => sum + (lead.value || 0), 0)
                return (
                  <div key={stage.name} className="min-w-0">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${stage.color}`} />
                        <h3 className="text-[12px] font-bold text-[#352B24]">{stage.name}</h3>
                        <span className="min-w-5 h-5 px-1.5 rounded-md bg-stone-100 text-stone-500 flex items-center justify-center text-[10px] font-semibold">{stageLeads.length}</span>
                      </div>
                      <button type="button" aria-label={`${stage.name} options`} className="text-stone-400 hover:text-stone-700"><MoreHorizontal size={17} /></button>
                    </div>
                    <p className="text-[10px] text-stone-400 mb-3">{formatCurrency(stageValue)} expected</p>
                    <div className="space-y-3">
                      {stageLeads.map((lead) => <LeadCard key={lead.id} lead={lead} onClick={() => navigate(`/leads/${lead.id}`, { state: { lead } })} />)}
                      {stageLeads.length === 0 && <div className="rounded-xl border border-dashed border-stone-200 p-6 text-center"><p className="text-[11px] text-stone-400">No leads in this stage</p></div>}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <button type="button" onClick={() => setClosedExpanded(!closedExpanded)} className="flex items-center gap-2 text-[11px] font-semibold text-stone-500 hover:text-[#A96C4B]">
                {closedExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                Closed stages
                <span className="text-[10px] font-medium bg-stone-100 px-2 py-0.5 rounded-md">{filteredLeads.filter((lead) => closedStages.includes(lead.stage)).length}</span>
              </button>
              {closedExpanded && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  {closedStages.map((stage) => {
                    const stageLeads = filteredLeads.filter((lead) => lead.stage === stage)
                    return (
                      <div key={stage} className="rounded-xl border border-stone-200 bg-[#FAF9F7] p-4">
                        <div className="flex justify-between items-center mb-3"><h3 className="text-[11px] font-bold text-stone-600">{stage}</h3><span className="text-[10px] text-stone-400">{stageLeads.length}</span></div>
                        {stageLeads.map((lead) => <div key={lead.id} className="bg-white rounded-lg border border-stone-100 p-3 mb-2 last:mb-0"><p className="text-[11px] font-semibold text-[#352B24]">{lead.name}</p><p className="text-[10px] text-stone-400 mt-1">{lead.company}</p></div>)}
                        {stageLeads.length === 0 && <p className="text-[10px] text-stone-400">No records</p>}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {view === "list" && <LeadsTable leads={filteredLeads} />}

        <div className="px-5 py-3 border-t border-stone-100 flex items-center justify-between">
          <p className="text-[10px] text-stone-400">Showing {filteredLeads.length} of {leads.length} leads</p>
          <p className="text-[10px] text-stone-400">Live data · MongoDB</p>
        </div>
      </section>

      <div className="flex items-center justify-between text-[10px] text-stone-400">
        <span>Copper OS · Leads Management</span><span>Pipeline overview</span>
      </div>

      {showAddLead && (
        <AddLeadModal onClose={() => setShowAddLead(false)} onCreate={handleCreateLead} existingLeads={leads} />
      )}
    </div>
  )
}

function SummaryCard({ title, value, description, icon: Icon, accent }) {
  const accents = {
    copper: "bg-[#F4EAE3] text-[#A96C4B]",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-rose-50 text-rose-600",
  }
  return (
    <div className="rounded-2xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-[0_3px_15px_rgba(60,45,30,0.025)]">
      <div className="flex items-start justify-between">
        <div><p className="text-[11px] font-medium text-stone-500">{title}</p><h3 className="text-[25px] font-bold tracking-tight text-[#352B24] mt-2">{value}</h3></div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accents[accent]}`}><Icon size={17} /></div>
      </div>
      <p className="text-[10px] text-stone-400 mt-3">{description}</p>
    </div>
  )
}

function LeadCard({ lead, onClick }) {
  const isUnassigned = !lead.owner
  const slaStyles = {
    Pending: "bg-stone-100 text-stone-500",
    "At risk": "bg-amber-50 text-amber-700",
    Met: "bg-emerald-50 text-emerald-700",
    Lapsed: "bg-rose-50 text-rose-600",
  }
  return (
    <article onClick={onClick} onKeyDown={(e) => e.key === "Enter" && onClick?.()} role="button" tabIndex={0} className="group rounded-xl border border-stone-200/80 bg-white p-3.5 hover:border-[#C69A7E]/70 hover:shadow-[0_5px_18px_rgba(60,45,30,0.055)] transition-all duration-200 cursor-pointer">
      <div className="flex items-center justify-between gap-2"><span className="text-[9px] text-stone-400 font-medium">{lead.id}</span><button type="button" aria-label="Lead options" className="text-stone-300 hover:text-stone-600"><MoreHorizontal size={16} /></button></div>
      <div className="flex items-center gap-2.5 mt-3">
        <div className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold ${lead.avatar || "bg-stone-100 text-stone-500"}`}>{lead.initials}</div>
        <div className="min-w-0"><h4 className="text-[12px] font-bold text-[#352B24] truncate">{lead.name}</h4><p className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1 truncate"><Building2 size={10} />{lead.company}</p></div>
      </div>
      <div className="flex items-center flex-wrap gap-1.5 mt-3"><PriorityBadge priority={lead.priority} /><span className={`px-2 py-1 rounded-md text-[9px] font-semibold ${slaStyles[lead.sla] || slaStyles.Pending}`}>{lead.sla || "Pending"}</span>{lead.age >= 21 && <span className="px-2 py-1 rounded-md bg-rose-50 text-rose-600 text-[9px] font-semibold flex items-center gap-1"><Flame size={10} />Ageing</span>}</div>
      <div className="flex flex-wrap gap-1 mt-3">{lead.services?.map((service) => <span key={service} className="px-2 py-1 rounded-md bg-[#F7F3EF] text-[#956344] text-[9px] font-medium">{service}</span>)}</div>
      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between"><div><p className="text-[9px] text-stone-400">Expected value</p><p className="text-[13px] font-bold text-[#352B24] mt-0.5">{formatCurrency(lead.value)}</p></div>{lead.confidence && <div className="text-right"><p className="text-[9px] text-stone-400">Win confidence</p><p className="text-[12px] font-bold text-[#A96C4B] mt-0.5">{lead.confidence}%</p></div>}</div>
      <div className="mt-3 rounded-lg bg-[#FAF9F7] p-2.5"><p className="text-[9px] text-stone-400 mb-1">NEXT STEP</p><p className="text-[10px] font-semibold text-stone-700">{lead.nextStep || "No next step set"}</p><p className="text-[9px] text-stone-400 mt-1 flex items-center gap-1"><CalendarDays size={10} />{lead.due || "No due date"}</p></div>
      <div className="mt-3 flex items-center justify-between">
        {isUnassigned ? <span className="text-[9px] font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">No user assigned</span> : <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-full bg-[#EADFD5] text-[#875438] flex items-center justify-center text-[8px] font-bold">{lead.owner.split(" ").map((part) => part[0]).join("")}</div><span className="text-[9px] text-stone-500">{lead.owner}</span></div>}
        <span className="text-[9px] text-stone-400">{lead.age}d old</span>
      </div>
    </article>
  )
}

function LeadsTable({ leads }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[1050px]">
        <thead><tr className="bg-[#FAF9F7] border-y border-stone-100">{["LEAD", "SOURCE", "SERVICE LINE", "STAGE", "PRIORITY", "WIN CONFIDENCE", "EXPECTED VALUE", "OWNER", "NEXT STEP", "AGE"].map((heading) => <th key={heading} className="px-4 py-3 text-[9px] font-bold tracking-[0.1em] text-stone-400 whitespace-nowrap">{heading}</th>)}</tr></thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-stone-100 last:border-0 hover:bg-[#FAF9F7] transition-colors">
              <td className="px-4 py-3.5"><div className="flex items-center gap-2.5"><div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${lead.avatar || "bg-stone-100 text-stone-500"}`}>{lead.initials}</div><div><p className="text-[11px] font-semibold text-[#352B24] whitespace-nowrap">{lead.name}</p><p className="text-[9px] text-stone-400 mt-0.5">{lead.id}</p></div></div></td>
              <td className="px-4 py-3.5 text-[10px] text-stone-500 whitespace-nowrap">{lead.source}</td>
              <td className="px-4 py-3.5"><div className="flex gap-1 flex-wrap max-w-[150px]">{lead.services?.map((service) => <span key={service} className="text-[9px] px-1.5 py-1 rounded-md bg-[#F4EAE3] text-[#956344] whitespace-nowrap">{service}</span>)}</div></td>
              <td className="px-4 py-3.5"><StageBadge stage={lead.stage} /></td>
              <td className="px-4 py-3.5"><PriorityBadge priority={lead.priority} /></td>
              <td className="px-4 py-3.5 text-[10px] text-stone-500">{lead.confidence ? `${lead.confidence}%` : "—"}</td>
              <td className="px-4 py-3.5 text-[11px] font-semibold text-[#352B24] whitespace-nowrap">{formatCurrency(lead.value)}</td>
              <td className="px-4 py-3.5 text-[10px] text-stone-500 whitespace-nowrap">{lead.owner || "Unassigned"}</td>
              <td className="px-4 py-3.5"><p className="text-[10px] text-stone-600 whitespace-nowrap">{lead.nextStep || "—"}</p><p className="text-[9px] text-stone-400 mt-1">{lead.due || "—"}</p></td>
              <td className="px-4 py-3.5 text-[10px] text-stone-500 whitespace-nowrap">{lead.age} days</td>
            </tr>
          ))}
          {leads.length === 0 && <tr><td colSpan="10" className="text-center py-12 text-[11px] text-stone-400">No leads match your filters.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function PriorityBadge({ priority }) {
  const styles = {
    Low: "bg-stone-100 text-stone-500",
    Medium: "bg-blue-50 text-blue-600",
    High: "bg-amber-50 text-amber-700",
    "Super High": "bg-rose-50 text-rose-600",
  }
  return <span className={`px-2 py-1 rounded-md text-[9px] font-semibold ${styles[priority] || styles.Medium}`}>{priority || "Medium"}</span>
}

function StageBadge({ stage }) {
  const styles = {
    New: "bg-slate-100 text-slate-600",
    Contacted: "bg-blue-50 text-blue-600",
    "Meeting scheduled": "bg-violet-50 text-violet-600",
    "Proposal sent": "bg-amber-50 text-amber-700",
    Won: "bg-emerald-50 text-emerald-700",
    Lost: "bg-rose-50 text-rose-600",
    Unqualified: "bg-stone-100 text-stone-500",
  }
  return <span className={`inline-flex px-2 py-1 rounded-md text-[9px] font-semibold whitespace-nowrap ${styles[stage] || styles.New}`}>{stage}</span>
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[9px] font-semibold tracking-wide text-stone-400 uppercase">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 min-w-[150px] rounded-lg border border-stone-200 bg-white px-3 text-[11px] text-stone-600 outline-none focus:border-[#C69A7E]">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

export default Leads
