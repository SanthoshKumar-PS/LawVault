
const ColorCard = ({ name, variable }: { name: string; variable: string }) => (
  <div className="flex flex-col gap-2">
    <div 
      className="h-24 w-full rounded-xl border shadow-sm flex items-center justify-center text-xs font-medium text-center px-2"
      style={{ backgroundColor: `hsl(var(${variable}))`, color: `hsl(var(--foreground))` }}
    >
      {/* This overlay ensures text is readable regardless of the background color */}
      <span className="bg-background/80 px-2 py-1 rounded-md backdrop-blur-sm border shadow-sm">
        {name}
      </span>
    </div>
    <code className="text-[10px] text-muted-foreground font-mono">{variable}</code>
  </div>
);

const Colors = () => {
  const themeColors = [
    { name: 'Background', variable: '--background' },
    { name: 'Foreground', variable: '--foreground' },
    { name: 'Primary', variable: '--primary' },
    { name: 'Secondary', variable: '--secondary' },
    { name: 'Muted', variable: '--muted' },
    { name: 'Accent', variable: '--accent' },
    { name: 'Destructive', variable: '--destructive' },
    { name: 'Success', variable: '--success' },
    { name: 'Warning', variable: '--warning' },
    { name: 'Card', variable: '--card' },
    { name: 'Border', variable: '--border' },
    { name: 'Input', variable: '--input' },
  ];

  const fileColors = [
    { name: 'Doc', variable: '--file-document' },
    { name: 'Image', variable: '--file-image' },
    { name: 'Video', variable: '--file-video' },
    { name: 'Audio', variable: '--file-audio' },
    { name: 'Archive', variable: '--file-archive' },
    { name: 'Default', variable: '--file-default' },
  ];

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        <header>
          <h1 className="text-2xl font-bold text-foreground">Law Vault Design System</h1>
          <p className="text-muted-foreground">Reference guide for theme variables.</p>
        </header>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Core Theme</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {themeColors.map((color) => (
              <ColorCard key={color.variable} {...color} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">File Type System</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {fileColors.map((color) => (
              <ColorCard key={color.variable} {...color} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Colors;