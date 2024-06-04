import React, { useState } from 'react';
import useShoes from '../hooks/useShoes';
import usePins from '../hooks/usePins';
import { Toaster, toast } from 'react-hot-toast';

const Maintenance: React.FC = () => {
  const { createShoe, deleteShoeBySize } = useShoes();
  const { pins, createPin, deletePin } = usePins();
  const [pinCount, setPinCount] = useState<number>(0);
  const [shoeSize, setShoeSize] = useState<number>(0);

  const handlePinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPinCount(parseInt(event.target.value));
  };

  const handleShoeSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShoeSize(parseInt(event.target.value));
  };

  const reportMissingPins = async () => {
    console.log(`Reporting ${pinCount} missing pins`);
    for (let i = 0; i < pinCount; i++) {
      await deletePin(i); // Assuming deletePin deletes the first pin found or needs an ID
     
    }
    toast.success(`${pinCount} Pins er slettet fra systemet`);
  };

  const orderNewPins = async () => {
    for (let i = 0; i < pinCount; i++) {
      await createPin({ id: pins.length + i + 1 }); // Assuming IDs are sequential and new pins get next ID
    }
    toast.success(`${pinCount} nye Pins bestilt til systemet`);
  };

  const reportMissingShoes = () => {
    console.log(`Reporting shoes of size ${shoeSize} missing`);
    deleteShoeBySize(shoeSize); // Slet sko af den angivne størrelse
    toast.success(`Et par sko i størrelse ${shoeSize} er slettet fra systemet`);
  };

  const orderNewShoes = () => {
    createShoe({ size: shoeSize });
    toast.success(`Nyt par sko i størrelse ${shoeSize} er bestilt til systemet`);
  };

  return (
    <>
    <Toaster />
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h1>Vedligehold</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h2>Pins</h2>
          <div>
            <h3>Rapporter manglende pins</h3>
            <input
              type="number"
              value={pinCount}
              onChange={handlePinChange}
            />
            <button onClick={reportMissingPins}>OK</button>
          </div>
          <div>
            <h3>Bestil nye pins</h3>
            <input
              type="number"
              value={pinCount}
              onChange={handlePinChange}
            />
            <button onClick={orderNewPins}>OK</button>
          </div>
        </div>
        <div>
          <h2>Bowling sko</h2>
          <div>
            <h3>Rapporter manglende par sko i størrelse</h3>
            <input
              type="number"
              value={shoeSize}
              onChange={handleShoeSizeChange}
            />
            <button onClick={reportMissingShoes}>OK</button>
          </div>
          <div>
            <h3>Bestil nyt par sko i størrelse</h3>
            <input
              type="number"
              value={shoeSize}
              onChange={handleShoeSizeChange}
            />
            <button onClick={orderNewShoes}>OK</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Maintenance;
