interface SectionLabelProps {
  scene: string;
  leftLabel: string;
  rightLabel: string;
  className?: string;
}

export default function SectionLabel({ scene, leftLabel, rightLabel, className }: SectionLabelProps) {
  return (
    <div className={`w-full text-[13px] ${className || ''}`.trim()}>
      <div className='flex flex-col gap-2.5 overflow-hidden'>
        <div className='flex items-center justify-between px-6 md:px-12 uppercase text-[#bbbbbb]'>
          <h6 className='whitespace-pre text-white'>{leftLabel}</h6>
          <h6 className='hidden whitespace-pre text-[#bbbbbb]/60 md:block'>SCENE — {scene}</h6>
          <h6 className='whitespace-pre'>{rightLabel}</h6>
        </div>
        <div className='h-px w-full bg-[#bbbbbb]/20' />
      </div>
    </div>
  );
}
