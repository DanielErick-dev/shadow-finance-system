"use client"

import React, { useState, type ReactNode, type ReactElement } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@base/components/ui/dialog"


type GenericFormModalProps = {
  open?: boolean
  onOpenChange?: (isOpen: boolean) => void
  triggerButton?: ReactNode
  title: string
  description: string
  children: ReactNode
  onSubmit?: () => Promise<void>
  isSubmitting: boolean
  submitText?: string
  showFooter?: boolean
  useInternalForm?: boolean
}
export default function GenericFormModal({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  triggerButton,
  title,
  description,
  children,
  onSubmit,
  isSubmitting,
  submitText = "Salvar",
  showFooter = true,
  useInternalForm = true,
}: GenericFormModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const onOpenChange = controlledOnOpenChange || setInternalOpen

  const handleRequestClose = () => onOpenChange(false)

  const handleSaveClick = async () => {
    if (!onSubmit) return
    try {
      await onSubmit()
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao submeter o modal:", error)
    }
  }

  const content = (
    <div>
      <DialogHeader className="sticky top-0 bg-slate-900 z-20 text-center border-b border-purple-800/30 pb-4">
        <DialogTitle className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          {title}
        </DialogTitle>
        <DialogDescription className="text-slate-400 mt-2 text-sm">
          {description}
        </DialogDescription>
      </DialogHeader>

      <div className="py-6">
        {React.isValidElement(children)
          ? React.cloneElement(children as ReactElement<any>, {
              onRequestClose: handleRequestClose,
            })
          : children}
      </div>

      {showFooter && (
        <DialogFooter className="border-t border-purple-800/30 pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleRequestClose}
            className="px-4 py-2 text-sm bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            onClick={handleSaveClick}
            disabled={isSubmitting}
            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg shadow-md shadow-purple-500/20 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 ease-in-out py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                PROCESSANDO...
              </>
            ) : (
              submitText
            )}
          </button>
        </DialogFooter>
      )}
    </div>
  )
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent
        className="bg-slate-900 border-2 border-purple-800/50 rounded-xl shadow-lg shadow-purple-500/20 text-slate-200 sm:max-w-md max-h-[90vh] overflow-y-auto"
      >
        {useInternalForm ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSaveClick()
            }}
          >
            {content}
          </form>
        ) : (
          content
        )}
      </DialogContent>
    </Dialog>
  )
}
