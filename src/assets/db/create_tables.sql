CREATE TABLE drivers (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE times (
    id UUID PRIMARY KEY,
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    car_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    stage_id INTEGER NOT NULL,
    time VARCHAR(10) NOT NULL,
    timestamp BIGINT NOT NULL,
    notes TEXT DEFAULT ''
);

CREATE INDEX idx_times_driver ON times(driver_id);
CREATE INDEX idx_times_car ON times(car_id);
CREATE INDEX idx_times_location ON times(location_id);
CREATE INDEX idx_times_stage ON times(stage_id);
