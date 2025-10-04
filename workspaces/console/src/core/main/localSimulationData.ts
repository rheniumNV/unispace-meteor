import { useCallback, useEffect, useState } from "react";
import path from "path";
import { SimulationInput, SimulationResult } from "@unispace-meteor/simulator";
import { readFileSync, writeFileSync } from "@unispace-meteor/common/dist/file";
import {
  ResultWithLoading,
  Success,
} from "@unispace-meteor/common/dist/type/result";
import { safeParse } from "@unispace-meteor/common/dist/util";

export type SimulationData = {
  id: string;
  title: string;
  meteor: {
    position: [number, number, number];
    power: [number, number, number];
    mass: number;
    size: number;
    visualIndex: number;
  };
  input: SimulationInput;
  result: SimulationResult;
  createdBy: string;
  createdAt: string;
};

//TODO: もうちょっとマシな方法を探す
const readLocalSimulationData = () => {
  const readFileSyncResult = readFileSync({
    path: path.resolve(process.cwd(), "./localSimulationData.json"),
  });
  if (readFileSyncResult.status === "SUCCESS") {
    const data = safeParse(readFileSyncResult.data) as unknown as Record<
      string,
      SimulationData
    >;
    return Object.entries(data).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: {
          ...value,
          input: {
            ...value.input,
            discovery: {
              ...value.input.discovery,
              t0: new Date(value.input.discovery.t0),
            },
          },
        },
      }),
      {},
    );
  }
  return {};
};

const writeLocalSimulationData = (data: Record<string, SimulationData>) => {
  return writeFileSync({
    path: path.resolve(process.cwd(), "./localSimulationData.json"),
    data: JSON.stringify(data),
  });
};

export const useLocalSimulationData = () => {
  const [localSimulationData, setLocalSimulationData] = useState<
    ResultWithLoading<Record<string, SimulationData>>
  >({
    status: "LOADING",
  });

  useEffect(() => {
    setLocalSimulationData(Success(readLocalSimulationData()));
  }, []);

  const saveSimulationData = useCallback((data: SimulationData) => {
    setLocalSimulationData((simulationData) => {
      if (simulationData.status === "SUCCESS") {
        const fixedData: SimulationData = {
          ...data,
          input: {
            ...data.input,
            discovery: {
              ...data.input.discovery,
              t0: data.input.discovery.t0.getTime() as unknown as Date,
            },
          },
        };
        writeLocalSimulationData({
          ...simulationData.data,
          [data.id]: fixedData,
        });
        return Success({
          ...simulationData.data,
          [data.id]: data,
        });
      }
      return simulationData;
    });
  }, []);

  const deleteSimulationData = useCallback((id: string) => {
    setLocalSimulationData((simulationData) => {
      if (simulationData.status === "SUCCESS") {
        const { [id]: _, ...rest } = { ...simulationData.data };
        writeLocalSimulationData({ ...rest });
        return Success({ ...rest });
      }
      return simulationData;
    });
  }, []);

  return {
    localSimulationData,
    saveSimulationData,
    deleteSimulationData,
  };
};
