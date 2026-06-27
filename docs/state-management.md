# Client State Management

## The Rule

| Data type                                                               | Where it lives                           |
| ----------------------------------------------------------------------- | ---------------------------------------- |
| Server data (creators, holdings, activity feed)                         | React Query (`useQuery` / `useMutation`) |
| Ephemeral UI state (modals, input values, selected tabs, loading flags) | Local `useState`                         |

If the value came from an API response and needs to survive a component unmount or be shared across routes, put it in React Query. If it only controls what the user sees right now and can be re-derived on re-mount, use `useState`.

## Query Invalidation vs Manual Refetch

**Invalidate** after a mutation that changes server data:

```ts
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: queryKeys.creators.list() });
```

This marks cached data stale and lets React Query refetch in the background the next time the query is observed. Use this after a buy, sell, or profile update so all subscribers see fresh data automatically.

**Refetch manually** only when you need to force an immediate reload independent of staleness — for example, a user-triggered "Refresh" button:

```ts
const { refetch } = useQuery({ queryKey: queryKeys.wallet.holdings(address), ... });
<button onClick={() => refetch()}>Refresh</button>
```

Avoid calling `refetch()` inside effects or after mutations — that bypasses cache coordination and can race with invalidation.

## Do Not Copy Server State into Local State

Storing a React Query result in `useState` breaks cache coherence and causes stale UI after mutations.

### Wrong

```tsx
function CreatorProfile({ id }: { id: string }) {
	const { data } = useCreatorDetail(id);

	// Never do this — local state diverges from the cache after mutations.
	const [creator, setCreator] = useState(data);

	return <div>{creator?.title}</div>;
}
```

### Right

```tsx
function CreatorProfile({ id }: { id: string }) {
	const { data: creator } = useCreatorDetail(id);

	// Read directly from the query result — always in sync with the cache.
	return <div>{creator?.title}</div>;
}
```

## Ephemeral UI State Examples

These belong in `useState`, not React Query:

- Modal open/closed: `const [open, setOpen] = useState(false)`
- Controlled input value: `const [query, setQuery] = useState('')`
- Active tab: `const [activeTab, setActiveTab] = useState('overview')`
- Optimistic loading flag: `const [submitting, setSubmitting] = useState(false)`

None of these values need to survive a page navigation or be shared with another component tree, so there is no reason to put them in the server-state layer.
