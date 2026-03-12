import { useState, useRef, useLayoutEffect, type CSSProperties } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import type { DropResult } from "@hello-pangea/dnd"


interface Task {
    id: string;
    title: string;
    priority: "Low" | "Medium" | "High";
    dueDate: string;
    clientName: string;
    assignee: {
        name: string;
    };
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

const initialKanbanData: Column[] = [
    {
        id: "todo",
        title: "To Do",
        tasks: [
            { id: "1", title: "New Inbound Lead", priority: "High", dueDate: "15 Mar", clientName: "PT. Maju Jaya", assignee: { name: "Budi Santoso" } },
            { id: "2", title: "Research Prospect Options", priority: "Medium", dueDate: "20 Mar", clientName: "Global Chem", assignee: { name: "Siti Rahmawati" } },
            { id: "3", title: "Update Contact Info", priority: "Low", dueDate: "22 Mar", clientName: "Plaza Property", assignee: { name: "Joko Anwar" } },
        ]
    },
    {
        id: "follow-up",
        title: "Follow Up",
        tasks: [
            { id: "4", title: "Call to discuss requirements", priority: "High", dueDate: "18 Mar", clientName: "XYZ Corp", assignee: { name: "Rina Kusuma" } },
            { id: "5", title: "Send Company Profile", priority: "Medium", dueDate: "14 Mar", clientName: "CV. Abadi", assignee: { name: "Budi Santoso" } },
            { id: "6", title: "Check on Email Sent Mon", priority: "Low", dueDate: "30 Mar", clientName: "Surya Indo", assignee: { name: "Dewi Lestari" } },
        ]
    },
    {
        id: "demo",
        title: "Demo",
        tasks: [
            { id: "7", title: "Product Demo Presentation", priority: "Medium", dueDate: "25 Mar", clientName: "Delta Corp", assignee: { name: "Siti Rahmawati" } },
            { id: "8", title: "Technical Showcase", priority: "High", dueDate: "16 Mar", clientName: "Global Chem", assignee: { name: "Joko Anwar" } },
        ]
    },
    {
        id: "quotation",
        title: "Quotation",
        tasks: [
            { id: "9", title: "Draft Proposal & Pricing", priority: "High", dueDate: "13 Mar", clientName: "Maju Jaya", assignee: { name: "Joko Anwar" } },
            { id: "10", title: "Calculate Bulk Discount", priority: "Medium", dueDate: "14 Mar", clientName: "Plaza Property", assignee: { name: "Rina Kusuma" } },
        ]
    },
    {
        id: "negotiation",
        title: "Negotiation",
        tasks: [
            { id: "11", title: "Review Contract Terms", priority: "Low", dueDate: "20 Mar", clientName: "Delta Corp", assignee: { name: "Dewi Lestari" } },
            { id: "12", title: "Counter offer review", priority: "High", dueDate: "12 Mar", clientName: "CV. Abadi", assignee: { name: "Budi Santoso" } },
        ]
    },
    {
        id: "po",
        title: "Purchase Order",
        tasks: [
            { id: "13", title: "Waiting for signed PO", priority: "Medium", dueDate: "19 Mar", clientName: "Surya Indo", assignee: { name: "Siti Rahmawati" } },
            { id: "14", title: "Process Invoice Payment", priority: "Low", dueDate: "18 Mar", clientName: "Global Logistics", assignee: { name: "Rina Kusuma" } },
        ]
    },
    {
        id: "closed-win",
        title: "Closed Won",
        tasks: [
            { id: "15", title: "Order Fulfilled", priority: "High", dueDate: "09 Mar", clientName: "PT Sentosa", assignee: { name: "Siti Rahmawati" } },
        ]
    },
    {
        id: "closed-lost",
        title: "Closed Lost",
        tasks: [
            { id: "16", title: "Lost - Budget Issues", priority: "Low", dueDate: "08 Mar", clientName: "Raja Oloan", assignee: { name: "Joko Anwar" } },
        ]
    }
]

export default function TasksPage() {
    const [kanbanData, setKanbanData] = useState<Column[]>(initialKanbanData)
    const boardRef = useRef<HTMLDivElement | null>(null)
    const [boardBounds, setBoardBounds] = useState<DOMRect | null>(null)

    useLayoutEffect(() => {
        const updateBounds = () => {
            if (boardRef.current) {
                setBoardBounds(boardRef.current.getBoundingClientRect())
            }
        }

        updateBounds()
        window.addEventListener("resize", updateBounds)
        window.addEventListener("scroll", updateBounds)
        return () => {
            window.removeEventListener("resize", updateBounds)
            window.removeEventListener("scroll", updateBounds)
        }
    }, [])

    const clampDragStyle = (style: CSSProperties | undefined, isDragging: boolean) => {
        if (!isDragging || !style || !boardBounds) return style
        if (typeof style.top !== "number") return style

        const minTop = boardBounds.top + 48
        if (style.top < minTop) {
            return { ...style, top: minTop }
        }
        return style
    }

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        // Dropped outside the list
        if (!destination) {
            return;
        }

        const sourceColIndex = kanbanData.findIndex(col => col.id === source.droppableId);
        const destColIndex = kanbanData.findIndex(col => col.id === destination.droppableId);

        if (sourceColIndex === -1 || destColIndex === -1) return;

        const sourceCol = kanbanData[sourceColIndex];
        const destCol = kanbanData[destColIndex];

        const sourceTasks = [...sourceCol.tasks];
        const destTasks = source.droppableId === destination.droppableId ? sourceTasks : [...destCol.tasks];

        const [removed] = sourceTasks.splice(source.index, 1);
        destTasks.splice(destination.index, 0, removed);

        const newKanbanData = [...kanbanData];
        newKanbanData[sourceColIndex] = { ...sourceCol, tasks: sourceTasks };
        newKanbanData[destColIndex] = { ...destCol, tasks: destTasks };

        setKanbanData(newKanbanData);
    };

    const getColumnTheme = (columnId: string) => {
        switch (columnId) {
            case "todo": return {
                bg: "bg-slate-100/60 border-slate-200/60",
                text: "text-slate-800",
                badge: "bg-slate-200 text-slate-700 border-none"
            };
            case "follow-up": return {
                bg: "bg-blue-50/60 border-blue-200/60",
                text: "text-blue-800",
                badge: "bg-blue-200/70 text-blue-800 border-none"
            };
            case "demo": return {
                bg: "bg-purple-50/60 border-purple-200/60",
                text: "text-purple-800",
                badge: "bg-purple-200/70 text-purple-800 border-none"
            };
            case "quotation": return {
                bg: "bg-amber-50/60 border-amber-200/60",
                text: "text-amber-800",
                badge: "bg-amber-200/70 text-amber-800 border-none"
            };
            case "negotiation": return {
                bg: "bg-orange-50/60 border-orange-200/60",
                text: "text-orange-800",
                badge: "bg-orange-200/70 text-orange-800 border-none"
            };
            case "po": return {
                bg: "bg-cyan-50/60 border-cyan-200/60",
                text: "text-cyan-800",
                badge: "bg-cyan-200/70 text-cyan-800 border-none"
            };
            case "closed-win": return {
                bg: "bg-emerald-50/60 border-emerald-200/60",
                text: "text-emerald-800",
                badge: "bg-emerald-200/70 text-emerald-800 border-none"
            };
            case "closed-lost": return {
                bg: "bg-rose-50/60 border-rose-200/60",
                text: "text-rose-800",
                badge: "bg-rose-200/70 text-rose-800 border-none"
            };
            default: return {
                bg: "bg-slate-100/60 border-slate-200/60",
                text: "text-slate-800",
                badge: "bg-slate-200 text-slate-700 border-none"
            };
        }
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-700 w-full min-w-0">
            {/* Page Header */}
            <div className="flex justify-end shrink-0 relative z-40 pb-5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                        <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition">
                            <ChevronLeft className="size-4" />
                        </button>
                        <div className="px-4 py-2 rounded-lg border border-slate-200 bg-white shadow-sm text-sm font-semibold text-slate-700 tracking-wide">
                            Januari 2026
                        </div>
                        <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition">
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                    <Button className="rounded-lg font-bold px-6 py-5 shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all">
                        Create Task
                    </Button>
                </div>
            </div>

            {/* Kanban Board Area */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div ref={boardRef} className="flex-1 w-full min-h-0 h-full overflow-x-auto overflow-y-hidden relative z-0 mt-4 pb-2 hover-scrollbar">
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10" />
                    <div className="flex gap-6 h-full min-h-full w-max items-stretch px-0.5">
                        {kanbanData.map((column) => {
                            const theme = getColumnTheme(column.id);
                            return (
                                <div key={column.id} className={`w-80 flex flex-col gap-3 h-full min-h-full ${theme.bg} border rounded-[1.25rem] p-3 shadow-sm overflow-hidden`}>
                                    {/* Column Header */}
                                    <div className="flex items-center justify-start px-1 shrink-0 pb-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className={`text-[15px] font-bold ${theme.text}`}>{column.title}</h3>
                                            <Badge variant="secondary" className={`rounded-full h-5 px-2 text-[10px] font-bold shadow-sm ${theme.badge}`}>
                                                {column.tasks.length}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Droppable Area */}
                                    <Droppable droppableId={column.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`flex flex-col gap-3 flex-1 min-h-0 h-full overflow-y-auto px-1 pb-2 rounded-xl transition-colors hover-scrollbar ${snapshot.isDraggingOver ? "bg-primary/5 ring-1 ring-inset ring-primary/20" : ""
                                                    }`}
                                            >
                                                {column.tasks.map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="relative"
                                                                style={{
                                                                    ...clampDragStyle(provided.draggableProps.style, snapshot.isDragging),
                                                                    opacity: snapshot.isDragging ? 0.9 : 1,
                                                                    zIndex: snapshot.isDragging ? 10 : 1,
                                                                }}
                                                            >
                                                                <Card
                                                                    className={`border-none transition-all duration-300 group cursor-grab active:cursor-grabbing rounded-xl overflow-hidden ${snapshot.isDragging ? "shadow-2xl shadow-primary/20 ring-2 ring-primary bg-white scale-105" : "shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] bg-white"
                                                                        }`}
                                                                >
                                                                    <CardContent className="p-3">
                                                                        {/* Card Top: Title & Priority */}
                                                                        <div className="space-y-2">
                                                                            <div className="flex justify-between items-start">
                                                                                <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors pr-2">
                                                                                    {task.title}
                                                                                </h4>
                                                                            </div>

                                                                            <div className="flex flex-col gap-1.5">
                                                                                <div className="flex items-center gap-2 mb-0.5">
                                                                                    <Badge
                                                                                        className={`text-[10px] font-semibold h-5 px-1.5 rounded border-none ${task.priority === "High" ? "bg-red-50 text-red-600" :
                                                                                            task.priority === "Medium" ? "bg-amber-50 text-amber-600" :
                                                                                                "bg-emerald-50 text-emerald-600"
                                                                                            }`}
                                                                                    >
                                                                                        {task.priority}
                                                                                    </Badge>
                                                                                    <span className="text-slate-500 font-semibold text-[10px]">{task.dueDate}</span>
                                                                                </div>
                                                                                <div className="flex flex-col gap-0.5">
                                                                                    <span className="font-semibold text-xs text-slate-700">{task.clientName}</span>
                                                                                    <span className="text-[11px] text-slate-500 font-medium">
                                                                                        {task.assignee.name}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}


                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </DragDropContext>
        </div>
    )
}

