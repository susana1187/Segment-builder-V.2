import Box from '@liveramp/motif/core/Box'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function HighlightMatch({ text, query }: { text: string; query: string }) {
  const q = query.trim()
  if (!q) return <>{text}</>

  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, 'ig'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <Box key={i} component="span" sx={{ fontWeight: 700 }}>
            {part}
          </Box>
        ) : (
          part
        ),
      )}
    </>
  )
}
