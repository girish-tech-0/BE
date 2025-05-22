"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { 
  AlertTriangle, 
  ArrowUpRight, 
  Building, 
  Calendar, 
  Check, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  MoreHorizontal, 
  Pause,
  Plus, 
  RotateCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KanbanColumn } from "./kanban-column";
import { SortableTicket } from "./sortable-ticket";
import { Ticket, TicketsState } from "./types";

interface KanbanBoardProps {
  tickets: TicketsState;
  onDragEnd: (result: any) => void;
}

const defaultTickets: TicketsState = {
  new: [],
  inProgress: [],
  scheduled: [],
  onHold: [],
  completed: []
};

export default function KanbanBoard({ tickets = defaultTickets, onDragEnd }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Find the active ticket
    const draggedTicket = Object.values(tickets).flat().find(
      ticket => ticket.id === active.id
    );
    setActiveTicket(draggedTicket || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveTicket(null);
      return;
    }

    const activeTicketId = active.id as string;
    const overTicketId = over.id as string;

    // Find which column the ticket is moving from and to
    let fromColumn: keyof TicketsState | null = null;
    let toColumn: keyof TicketsState | null = null;

    Object.entries(tickets).forEach(([columnId, columnTickets]) => {
      if (columnTickets.find(ticket => ticket.id === activeTicketId)) {
        fromColumn = columnId as keyof TicketsState;
      }
      if (columnTickets.find(ticket => ticket.id === overTicketId)) {
        toColumn = columnId as keyof TicketsState;
      }
    });

    if (!fromColumn || !toColumn || fromColumn === toColumn) {
      setActiveId(null);
      setActiveTicket(null);
      return;
    }

    onDragEnd({ source: fromColumn, destination: toColumn, ticketId: activeTicketId });
    setActiveId(null);
    setActiveTicket(null);
  };

  const getColumnIcon = (status: string) => {
    switch (status) {
      case "new": return <Plus className="h-4 w-4 text-blue-500" />;
      case "inProgress": return <RotateCw className="h-4 w-4 text-yellow-500" />;
      case "scheduled": return <Calendar className="h-4 w-4 text-purple-500" />;
      case "onHold": return <Pause className="h-4 w-4 text-orange-500" />;
      case "completed": return <Check className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const getColumnTitle = (status: string) => {
    switch (status) {
      case "new": return "New";
      case "inProgress": return "In Progress";
      case "scheduled": return "Scheduled";
      case "onHold": return "On Hold";
      case "completed": return "Completed";
      default: return status;
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-2 pb-10 overflow-x-auto">
        {Object.entries(tickets).map(([status, columnTickets]) => (
          <KanbanColumn
            key={status}
            id={status}
            title={getColumnTitle(status)}
            icon={getColumnIcon(status)}
            tickets={columnTickets}
          />
        ))}
      </div>

      <DragOverlay>
        {activeId && activeTicket ? (
          <Card className="w-[280px] shadow-lg">
            <SortableTicket ticket={activeTicket} />
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}