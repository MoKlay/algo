import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import usePrompt from "./components/Prompt";
import useAlert, { TypeAlert } from "./components/Alert";
import "./sass/main.css";
import Input from "./components/Input";
import classNames from "classnames";

function App() {
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [consumers, setConsumers] = useState<string[]>([]);
  const [costs, setCosts] = useState<number[][]>([]);
  const [supplies, setSupplies] = useState<number[]>([]);
  const [demands, setDemands] = useState<number[]>([]);
  const [shipments, setShipments] = useState<number[][]>(
    Array(suppliers.length)
      .fill(null)
      .map(() => Array(consumers.length).fill(0))
  );

  const [promptSupplier, setOpenSupplier, supplier] = usePrompt();
  const [promptConsumer, setOpenConsumer, consumer] = usePrompt();
  const [alertMessage, setAlertMessage] = useAlert();
  const [isBalanced, setIsBalanced] = useState<boolean>(true);

  const totalSupply = useMemo<number>(
    () => supplies.reduce((sum, supply) => sum + supply, 0),
    [supplies]
  );
  const totalDemand = useMemo<number>(
    () => demands.reduce((sum, demand) => sum + demand, 0),
    [demands]
  );

  useEffect(() => {
    setIsBalanced(totalSupply === totalDemand);
    if (totalSupply !== totalDemand) {
      setAlertMessage(
        TypeAlert.Warning,
        `Задача несбалансирована. Общие запасы: ${totalSupply}, Общие потребности: ${totalDemand}`
      );
    }
  }, [supplies, demands]);

  useEffect(() => {
    if (typeof supplier !== "undefined" && supplier.trim() !== "") {
      setSuppliers((prevSuppliers) => [...prevSuppliers, supplier.trim()]);
      setSupplies((prevSupplies) => [...prevSupplies, 0]);
      setCosts((prevCosts) => [
        ...prevCosts,
        ...[Array(consumers.length).fill(0)],
      ]);
      setShipments((prevShipments) => [
        ...prevShipments,
        Array(consumers.length).fill(0),
      ]);
      setAlertMessage(
        TypeAlert.Success,
        `Поставщик "${supplier.trim()}" добавлен.`
      );
    }
  }, [supplier]);

  useEffect(() => {
    if (typeof consumer !== "undefined" && consumer.trim() !== "") {
      setConsumers((prevConsumers) => [...prevConsumers, consumer.trim()]);
      setDemands((prevDemands) => [...prevDemands, 0]);
      setCosts((prevCosts) => prevCosts.map((row) => [...row, 0]));
      setShipments((prevShipments) => prevShipments.map((row) => [...row, 0]));
      setAlertMessage(
        TypeAlert.Success,
        `Потребитель ${consumer.trim()} добавлен.`
      );
    }
  }, [consumer]);

  const removeSupplier = (index: number): void => {
    setSuppliers((prevSuppliers) => {
      const newSuppliers = [...prevSuppliers];
      newSuppliers.splice(index, 1);
      return newSuppliers;
    });
    setSupplies((prevSupplies) => {
      const newSupplies = [...prevSupplies];
      newSupplies.splice(index, 1);
      return newSupplies;
    });
    setCosts((prevCosts) => {
      const newCosts = [...prevCosts];
      newCosts.splice(index, 1);
      return newCosts;
    });
    setShipments((prevShipments) => {
      const newShipments = [...prevShipments];
      newShipments.splice(index, 1);
      return newShipments;
    });
    setAlertMessage(TypeAlert.Success, `Поставщик удален.`);
  };

  const removeConsumer = (index: number): void => {
    setConsumers((prevConsumers) => {
      const newConsumers = [...prevConsumers];
      newConsumers.splice(index, 1);
      return newConsumers;
    });
    setDemands((prevDemands) => {
      const newDemands = [...prevDemands];
      newDemands.splice(index, 1);
      return newDemands;
    });
    setCosts((prevCosts) => {
      return prevCosts.map((row) => {
        const newRow = [...row];
        newRow.splice(index, 1);
        return newRow;
      });
    });
    setShipments((prevShipments) => {
      return prevShipments.map((row) => {
        const newRow = [...row];
        newRow.splice(index, 1);
        return newRow;
      });
    });
    setAlertMessage(TypeAlert.Success, `Потребитель удален.`);
  };

  const updateCost = (
    rowIndex: number,
    colIndex: number,
    value: string
  ): void => {
    setCosts((prevCosts) =>
      prevCosts.map((row, i) =>
        i === rowIndex
          ? row.map((cost, j) => (j === colIndex ? parseInt(value) || 0 : cost))
          : row
      )
    );
  };

  const updateShipment = (
    rowIndex: number,
    colIndex: number,
    value: string
  ): void => {
    setShipments((prevShipments) =>
      prevShipments.map((row, i) =>
        i === rowIndex
          ? row.map((shipment, j) =>
              j === colIndex ? parseInt(value) || 0 : shipment
            )
          : row
      )
    );
  };

  const updateSupply = (index: number, value: string): void => {
    setSupplies((prevSupplies) =>
      prevSupplies.map((supply, i) =>
        i === index ? parseInt(value) || 0 : supply
      )
    );
  };

  const updateDemand = (index: number, value: string): void => {
    setDemands((prevDemands) =>
      prevDemands.map((demand, i) =>
        i === index ? parseInt(value) || 0 : demand
      )
    );
  };

  return (
    <div className="container">
      <h2 className="heading">Транспортная задача</h2>

      {alertMessage}
      {promptConsumer}
      {promptSupplier}

      <div className="buttons">
        <button
          onClick={(_) =>
            setOpenSupplier("Добавление поставщика", "Введите имя поставщика")
          }
        >
          Добавить поставщика
        </button>

        <button
          onClick={(_) =>
            setOpenConsumer("Добавление потребителя", "Введите имя потребителя")
          }
        >
          Добавить потребителя
        </button>
      </div>

      {suppliers.length !== 0 && consumers.length !== 0 && (
        <>
          <div className="con-table">
            <table>
              <thead>
                <tr>
                  <th></th>
                  {consumers.map((consumer, index) => (
                    <th key={index}>
                      {consumer}
                      <button
                        className="removeButton"
                        onClick={() => removeConsumer(index)}
                      >
                        Удалить
                      </button>
                    </th>
                  ))}
                  <th>Запасы</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier, rowIndex) => (
                  <tr key={rowIndex}>
                    <th>
                      {supplier}
                      <button
                        className="removeButton"
                        onClick={() => removeSupplier(rowIndex)}
                      >
                        Удалить
                      </button>
                    </th>
                    {consumers.map((consumer, colIndex) => (
                      <td key={colIndex}>
                        <div className="data">
                          <label>
                            Стоимость:
                            <Input
                              value={costs[rowIndex][colIndex]}
                              onChange={(e) =>
                                updateCost(rowIndex, colIndex, e.target.value)
                              }
                            />
                          </label>
                          <label>
                            Отгружено:
                            <Input
                              value={shipments[rowIndex][colIndex]}
                              onChange={(e) =>
                                updateShipment(
                                  rowIndex,
                                  colIndex,
                                  e.target.value
                                )
                              }
                            />
                          </label>
                        </div>
                      </td>
                    ))}
                    <td>
                      <input
                        type="number"
                        value={supplies[rowIndex]}
                        onChange={(e) => updateSupply(rowIndex, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <th>Потребности</th>
                  {demands.map((demand, index) => (
                    <td key={index}>
                      <input
                        type="number"
                        value={demand}
                        onChange={(e) => updateDemand(index, e.target.value)}
                      />
                    </td>
                  ))}
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="balanceInfo">
            <p>Общие запасы: {totalSupply}</p>
            <p>Общие потребности: {totalDemand}</p>
            <p className={classNames({balanced: isBalanced}, {unbalanced: !isBalanced})}>
              <b>Задача сбалансирована: {isBalanced ? "Да" : "Нет"}</b>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
