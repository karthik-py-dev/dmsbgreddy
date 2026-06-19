-- Optional BG Reddy Website DMS visibility helpers
-- Run only if website login works but dashboard cards/dues/reminders show empty due missing RPCs.

create or replace function public.current_user_clinic_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select clinic_id
  from public.profiles
  where id = auth.uid()
    and active = true
  limit 1;
$$;

grant execute on function public.current_user_clinic_id() to authenticated;

create or replace function public.get_workflow_dashboard_summary()
returns table (
  today_revenue numeric,
  pending_payments numeric,
  op_fee_revenue_today numeric,
  medication_revenue_today numeric,
  waiting_count integer,
  completed_count integer,
  today_patient_count integer
)
language sql
security definer
set search_path = public
as $$
  select
    coalesce((
      select sum(p.amount)
      from public.payments p
      where p.clinic_id = public.current_user_clinic_id()
        and p.created_at::date = current_date
    ), 0)::numeric as today_revenue,

    coalesce((
      select sum(i.due_amount)
      from public.invoices i
      where i.clinic_id = public.current_user_clinic_id()
        and coalesce(i.due_amount, 0) > 0
    ), 0)::numeric as pending_payments,

    coalesce((
      select sum(p.amount)
      from public.payments p
      join public.invoices i on i.id = p.invoice_id
      where p.clinic_id = public.current_user_clinic_id()
        and p.created_at::date = current_date
        and i.invoice_type in ('op_fee', 'consultation_fee')
    ), 0)::numeric as op_fee_revenue_today,

    coalesce((
      select sum(p.amount)
      from public.payments p
      join public.invoices i on i.id = p.invoice_id
      where p.clinic_id = public.current_user_clinic_id()
        and p.created_at::date = current_date
        and i.invoice_type = 'medication_fee'
    ), 0)::numeric as medication_revenue_today,

    coalesce((
      select count(*)
      from public.appointments a
      where a.clinic_id = public.current_user_clinic_id()
        and a.appointment_time::date = current_date
        and lower(coalesce(a.status, '')) in ('scheduled', 'waiting', 'checked_in', 'booked')
    ), 0)::integer as waiting_count,

    coalesce((
      select count(*)
      from public.appointments a
      where a.clinic_id = public.current_user_clinic_id()
        and a.appointment_time::date = current_date
        and lower(coalesce(a.status, '')) in ('completed', 'done')
    ), 0)::integer as completed_count,

    coalesce((
      select count(distinct a.patient_id)
      from public.appointments a
      where a.clinic_id = public.current_user_clinic_id()
        and a.appointment_time::date = current_date
    ), 0)::integer as today_patient_count;
$$;

grant execute on function public.get_workflow_dashboard_summary() to authenticated;

notify pgrst, 'reload schema';

select 'BG REDDY WEBSITE DMS HELPERS READY' as result;
