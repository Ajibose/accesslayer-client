import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useFormatXlm } from '@/hooks/useFormatXlm';
import showToast from '@/utils/toast.util';
import { useBatchBuyMutation } from '@/hooks/useWallet';

export interface BatchOrderRow {
  creatorId: string;
  priceStroops: number;
  quantity: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_KEYS = 5;

export default function BatchBuyModal({ open, onOpenChange }: Props) {
  const [rows, setRows] = useState<BatchOrderRow[]>([]);
  const [addInput, setAddInput] = useState('');
  const { format } = useFormatXlm();
  const mutation = useBatchBuyMutation();

  const totalStroops = useMemo(() => {
    return rows.reduce((acc, r) => acc + (r.priceStroops * r.quantity), 0);
  }, [rows]);

  const totalXlm = format(totalStroops);

  const handleAdd = () => {
    if (!addInput) return;
    if (rows.length >= MAX_KEYS) {
      showToast.error(`Maximum ${MAX_KEYS} keys per batch`);
      return;
    }

    // For demo: assume price 1 XLM = 10_000_000 stroops
    const defaultPrice = 10_000_000;
    const newRow: BatchOrderRow = {
      creatorId: addInput,
      priceStroops: defaultPrice,
      quantity: 1,
    };
    setRows(r => [...r, newRow]);
    setAddInput('');
  };

  const handleRemove = (idx: number) => {
    setRows(r => r.filter((_, i) => i !== idx));
  };

  const handleQuantityChange = (idx: number, q: number) => {
    setRows(r => r.map((row, i) => (i === idx ? { ...row, quantity: q } : row)));
  };

  const handleConfirm = async () => {
    if (rows.length === 0) return;
    try {
      showToast.loading('Submitting batch buy...');
      await mutation.mutateAsync({ orders: rows });
      showToast.transactionSuccess('Batch buy submitted');
      onOpenChange(false);
      setRows([]);
    } catch {
      showToast.error('Batch buy failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Batch Buy Keys</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              value={addInput}
              onChange={e => setAddInput(e.target.value)}
              placeholder="Search or enter creator id"
              className="flex-1 rounded-xl bg-white/[0.04] px-3 py-2 text-white"
            />
            <Button onClick={handleAdd}>Add</Button>
          </div>

          {rows.length === 0 ? (
            <p className="text-sm text-white/60">No keys added</p>
          ) : (
            <div className="space-y-2">
              {rows.map((row, idx) => (
                <div key={row.creatorId} className="flex items-center gap-2">
                  <div className="w-40 text-sm truncate">{row.creatorId}</div>
                  <div className="w-28 text-sm">{format(row.priceStroops)}</div>
                  <input
                    type="number"
                    min={1}
                    value={row.quantity}
                    onChange={e => handleQuantityChange(idx, Math.max(1, Number(e.target.value || 1)))}
                    className="w-24 rounded-xl bg-white/[0.04] px-2 py-1 text-white"
                  />
                  <div className="flex-1 text-sm text-white/60">
                    Subtotal: {format(row.priceStroops * row.quantity)} XLM
                  </div>
                  <Button variant="ghost" onClick={() => handleRemove(idx)}>Remove</Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="text-sm text-white/60">Total</div>
            <div className="font-bold text-white">{totalXlm} XLM</div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={rows.length === 0}>Confirm</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
