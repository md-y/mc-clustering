import { versions } from '@mc-clustering/mc-datagen/config';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { getAssignment, getModels, getNParams } from '../globs/assignments';

type Version = (typeof versions)[number];

const ITEM_SIZE = 64;

const nParams = getNParams();
const models = getModels();

export function App() {
  const [version, setVersion] = useState<Version>(versions[0]);
  const [n, setN] = useState<number>(nParams[0] ?? 40);
  const [model, setModel] = useState<string>(models[0] ?? 'kmeans');

  return (
    <>
      <div className="bg-slate-600 flex items-center p-4 gap-4">
        <h1 className="text-3xl text-white font-semibold">MC Clustering</h1>
        <select className="p-1" onChange={(e) => setVersion(e.target.value as Version)}>
          {versions.map((ver) => (
            <option key={ver} value={ver}>Version {ver}</option>
          ))}
        </select>
        <select className="p-1" onChange={(e) => setN(parseInt(e.target.value))}>
          {nParams.map((n) => (
            <option key={n} value={n}>n = {n}</option>
          ))}
        </select>
        <select className="p-1" onChange={(e) => setModel(e.target.value)}>
          {models.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>
      <Assignment version={version} n={n} />
    </>
  );
}

const Assignment: FC<{ version: Version; n: number }> = ({ version, n }) => {
  const assignment = useMemo(() => getAssignment(version, 'kmeans', n), [version, n]);
  return (
    <div className="flex flex-wrap p-8 bg-slate-700 gap-4 justify-center">
      {assignment.map((items, idx) => (
        <AssignmentGrid items={items} key={items.join()} groupNum={idx + 1} />
      ))}
    </div>
  );
};

const AssignmentGrid: FC<{ items: string[]; groupNum: number }> = ({ items, groupNum }) => {
  const sortedItems = useMemo(() => items.toSorted(), [items]);

  const width = 8 * ITEM_SIZE;
  const height = Math.ceil(sortedItems.length / 8) * ITEM_SIZE;

  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setVisible(entry.isIntersecting);
      });
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-slate-500 p-2 rounded-lg" ref={ref}>
      <h3 className="text-white text-2xl mb-2">
        Group {groupNum} ({sortedItems.length} items)
      </h3>
      <div className="flex flex-wrap" style={{ width: `${width}px`, height: `${height}px` }}>
        {visible && sortedItems.map((item) => <ItemImage key={item} id={item} />)}
      </div>
    </div>
  );
};

const ItemImage: FC<{ id: string }> = ({ id }) => {
  if (id.startsWith('minecraft:')) id = id.replace('minecraft:', '');
  return <div style={{ width: ITEM_SIZE, height: ITEM_SIZE }} className={`rc-item rc-minecraft_${id}`} title={id} />;
};

export default App;
