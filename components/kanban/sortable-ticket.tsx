"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  Building, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText,
  IndianRupee,
  MessageSquare, 
  MoreHorizontal,
  Receipt,
  User
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TicketDetailsDialog } from "@/components/tickets/ticket-details-dialog";
import type { Ticket } from "./types";

interface SortableTicketProps {
  ticket: Ticket;
}

export function SortableTicket({ ticket }: SortableTicketProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  
  const totalExpenses = ticket.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
  const netAmount = (ticket.workStage?.quoteAmount || 0) - totalExpenses;

  const priorityColor = 
    ticket.priority === "Critical" ? "bg-destructive" : 
    ticket.priority === "High" ? "bg-orange-500" : 
    ticket.priority === "Medium" ? "bg-yellow-500" : "bg-blue-500";

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="mb-3 cursor-grab hover:border-accent-foreground/20 transition-all duration-200"
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-3 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{ticket.id}</Badge>
            <div className={`h-2 w-2 rounded-full ${priorityColor}`} title={`Priority: ${ticket.priority}`}></div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Update Work Stage</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Change Status</DropdownMenuItem>
              <DropdownMenuItem>Edit Ticket</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <h3 className="font-medium mt-2 line-clamp-2">{ticket.title}</h3>
        
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <Building className="mr-1 h-4 w-4" />
          <span className="truncate">{ticket.client} - {ticket.branch}</span>
        </div>
        
        <div className="mt-3 space-y-2">
          <TooltipProvider>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <Tooltip>
                <TooltipTrigger className="flex items-center">
                  <Receipt className="mr-1 h-3 w-3" />
                  <span>Quote: #{ticket.workStage?.quoteNo}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Amount: ₹{ticket.workStage?.quoteAmount}</p>
                  <p>Taxable: ₹{ticket.workStage?.quoteTaxable}</p>
                </TooltipContent>
              </Tooltip>
              
              <div className="flex items-center">
                <FileText className="mr-1 h-3 w-3" />
                <span>PO: {ticket.workStage?.poNumber || 'Pending'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <User className="mr-1 h-3 w-3" />
                <span>Agent: {ticket.workStage?.agentName}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                <span>{ticket.workStage?.dateReceived}</span>
              </div>
            </div>
          </TooltipProvider>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="secondary" className="text-xs">
            {ticket.workStage?.workStatus}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {ticket.workStage?.poStatus}
          </Badge>
          <Badge variant="outline" className="text-xs">
            JCR: {ticket.workStage?.jcrStatus}
          </Badge>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={ticket.assignee.avatar} alt={ticket.assignee.name} />
              <AvatarFallback>{ticket.assignee.initials}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{ticket.assignee.name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {ticket.comments > 0 && (
              <div className="flex items-center text-xs text-muted-foreground">
                <MessageSquare className="mr-1 h-3 w-3" />
                <span>{ticket.comments}</span>
              </div>
            )}
            
            {ticket.dueDate && !ticket.completedDate && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                <span>Due: {ticket.dueDate}</span>
              </div>
            )}
            
            {ticket.scheduledDate && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                <span>{ticket.scheduledDate.split(',')[0]}</span>
              </div>
            )}
            
            {ticket.completedDate && (
              <div className="flex items-center text-xs text-muted-foreground">
                <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                <span>{ticket.completedDate}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
        <div className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium">Quote:</span>
            <span>₹{(ticket.workStage?.quoteAmount || 0).toLocaleString()}</span>
          </div>
          {ticket.expenses?.map((expense, idx) => (
            <div key={idx} className="flex justify-between text-muted-foreground">
              <span>{expense.label}:</span>
              <span>₹{expense.amount.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold text-sm">
            <span>Total Expenses:</span>
            <span>₹{totalExpenses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-green-600 dark:text-green-400 text-sm">
            <span>Net Amount:</span>
            <span>₹{netAmount.toLocaleString()}</span>
          </div>
        </div>


      
        <div className="flex justify-between text-sm text-green-700 dark:text-green-400">
          <span className="font-medium">Payment:</span>
          <span>{ticket.paymentReceived ? "Received" : "Pending"}</span>
        </div>
    <CardFooter className="p-3 flex justify-end">
        <TicketDetailsDialog ticket={ticket} />
      </CardFooter>
    </Card>
  );
}