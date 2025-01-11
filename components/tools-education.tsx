"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

export function ToolsEducation() {
  const AVAILABLE_TOOLS = [
    {
      name: "Copy to Clipboard",
      description: "Copy text to your clipboard",
    },
    {
      name: "Get Current Time",
      description: "Get the current time",
    },
    {
      name: "Party Mode",
      description: "Start a celebration with confetti",
    },
    {
      name: "Launch Website",
      description: "Open a website in a new tab",
    },
    {
      name: "Scrape Website",
      description: "Extract content from a website",
    },
  ] as const;

  return (
    <div className="w-full max-w-lg mt-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="tools">
          <AccordionTrigger>Available Tools</AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableBody>
                {AVAILABLE_TOOLS.map((tool) => (
                  <TableRow key={tool.name}>
                    <TableCell className="font-medium">{tool.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {tool.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
