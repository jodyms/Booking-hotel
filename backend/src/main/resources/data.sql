-- Sample amenities data for hotel booking system
-- This file will be executed automatically by Spring Boot

-- Insert sample amenities if they don't already exist
INSERT IGNORE INTO amenities (name, description, icon, is_active, created_at, updated_at) VALUES
('WiFi', 'Free wireless internet access', 'wifi', true, NOW(), NOW()),
('Air Conditioning', 'Climate control with air conditioning', 'ac', true, NOW(), NOW()),
('TV', 'Flat screen television with cable channels', 'tv', true, NOW(), NOW()),
('Mini Bar', 'In-room mini refrigerator with beverages and snacks', 'minibar', true, NOW(), NOW()),
('Room Service', '24-hour room service available', 'room-service', true, NOW(), NOW()),
('Safe', 'In-room safety deposit box', 'safe', true, NOW(), NOW()),
('Balcony', 'Private balcony with outdoor seating', 'balcony', true, NOW(), NOW()),
('Ocean View', 'Room with ocean view', 'ocean-view', true, NOW(), NOW()),
('City View', 'Room with city skyline view', 'city-view', true, NOW(), NOW()),
('Hot Tub', 'Private hot tub or jacuzzi', 'hot-tub', true, NOW(), NOW()),
('Fireplace', 'In-room fireplace', 'fireplace', true, NOW(), NOW()),
('Kitchen', 'Full kitchen with cooking facilities', 'kitchen', true, NOW(), NOW()),
('Kitchenette', 'Small kitchen area with basic cooking facilities', 'kitchenette', true, NOW(), NOW()),
('Washing Machine', 'In-room washing machine', 'washing-machine', true, NOW(), NOW()),
('Parking', 'Dedicated parking space', 'parking', true, NOW(), NOW()),
('Pet Friendly', 'Pets allowed in room', 'pet-friendly', true, NOW(), NOW()),
('Smoking Allowed', 'Smoking permitted in room', 'smoking', true, NOW(), NOW()),
('Non-Smoking', 'Non-smoking room', 'no-smoking', true, NOW(), NOW()),
('Desk', 'Work desk with chair', 'desk', true, NOW(), NOW()),
('Sofa', 'Comfortable seating area with sofa', 'sofa', true, NOW(), NOW()),
('Coffee Maker', 'In-room coffee making facilities', 'coffee', true, NOW(), NOW()),
('Hair Dryer', 'Hair dryer available in bathroom', 'hair-dryer', true, NOW(), NOW()),
('Iron & Ironing Board', 'Iron and ironing board provided', 'iron', true, NOW(), NOW()),
('Bathtub', 'Full bathtub in bathroom', 'bathtub', true, NOW(), NOW()),
('Shower', 'Separate shower in bathroom', 'shower', true, NOW(), NOW()),
('Towels', 'Fresh towels provided', 'towels', true, NOW(), NOW()),
('Toiletries', 'Complimentary toiletries', 'toiletries', true, NOW(), NOW()),
('Gym Access', 'Access to hotel gym facilities', 'gym', true, NOW(), NOW()),
('Pool Access', 'Access to hotel swimming pool', 'pool', true, NOW(), NOW()),
('Spa Access', 'Access to hotel spa services', 'spa', true, NOW(), NOW());

-- Sample rooms data for testing dashboard functionality
INSERT IGNORE INTO rooms (room_number, room_type, price, adult_capacity, children_capacity, description, is_active, created_at, updated_at) VALUES
('101', 'STANDARD', 150.00, 2, 1, 'Comfortable standard room with city view', true, NOW(), NOW());

INSERT IGNORE INTO rooms (room_number, room_type, price, adult_capacity, children_capacity, description, is_active, created_at, updated_at) VALUES
('102', 'STANDARD', 150.00, 2, 1, 'Cozy standard room with modern amenities', true, NOW(), NOW());

INSERT IGNORE INTO rooms (room_number, room_type, price, adult_capacity, children_capacity, description, is_active, created_at, updated_at) VALUES
('103', 'DELUXE', 250.00, 2, 2, 'Spacious deluxe room with balcony', true, NOW(), NOW());

INSERT IGNORE INTO rooms (room_number, room_type, price, adult_capacity, children_capacity, description, is_active, created_at, updated_at) VALUES
('104', 'DELUXE', 250.00, 2, 2, 'Elegant deluxe room with premium furnishing', true, NOW(), NOW());

INSERT IGNORE INTO rooms (room_number, room_type, price, adult_capacity, children_capacity, description, is_active, created_at, updated_at) VALUES
('201', 'SUITE', 450.00, 4, 2, 'Luxury suite with separate living area', true, NOW(), NOW());

INSERT IGNORE INTO rooms (room_number, room_type, price, adult_capacity, children_capacity, description, is_active, created_at, updated_at) VALUES
('202', 'SUITE', 450.00, 4, 2, 'Presidential suite with ocean view', true, NOW(), NOW());

INSERT IGNORE INTO rooms (room_number, room_type, price, adult_capacity, children_capacity, description, is_active, created_at, updated_at) VALUES
('203', 'STANDARD', 150.00, 2, 1, 'Standard room with garden view', true, NOW(), NOW());

INSERT IGNORE INTO rooms (room_number, room_type, price, adult_capacity, children_capacity, description, is_active, created_at, updated_at) VALUES
('204', 'DELUXE', 250.00, 2, 2, 'Deluxe room with kitchenette', true, NOW(), NOW());

INSERT IGNORE INTO rooms (room_number, room_type, price, adult_capacity, children_capacity, description, is_active, created_at, updated_at) VALUES
('301', 'SUITE', 450.00, 4, 2, 'Penthouse suite with panoramic views', true, NOW(), NOW());

INSERT IGNORE INTO rooms (room_number, room_type, price, adult_capacity, children_capacity, description, is_active, created_at, updated_at) VALUES
('302', 'STANDARD', 150.00, 2, 1, 'Standard room near elevator', true, NOW(), NOW());

-- Sample bookings for testing dashboard functionality
-- Today's check-ins (status: BOOKED, check-in date: today)
INSERT IGNORE INTO bookings (first_name, last_name, pronouns, check_in_date, check_out_date, adult_capacity, children_capacity, room_id, total_amount, status, created_at, updated_at) VALUES
('John', 'Smith', 'he/him', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 2, 0, 1, 450.00, 'BOOKED', NOW(), NOW()),
('Sarah', 'Johnson', 'she/her', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 2, 1, 3, 500.00, 'BOOKED', NOW(), NOW()),
('Mike', 'Davis', 'he/him', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY), 4, 2, 5, 1800.00, 'BOOKED', NOW(), NOW()),
('Emily', 'Wilson', 'she/her', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 0, 7, 150.00, 'BOOKED', NOW(), NOW()),
('David', 'Brown', 'he/him', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY), 2, 2, 8, 1250.00, 'BOOKED', NOW(), NOW());

-- Today's check-outs (status: CHECKED_IN, check-out date: today)
INSERT IGNORE INTO bookings (first_name, last_name, pronouns, check_in_date, check_out_date, adult_capacity, children_capacity, room_id, total_amount, status, created_at, updated_at) VALUES
('Lisa', 'Anderson', 'she/her', DATE_SUB(CURDATE(), INTERVAL 2 DAY), CURDATE(), 2, 1, 2, 300.00, 'CHECKED_IN', NOW(), NOW()),
('Robert', 'Taylor', 'he/him', DATE_SUB(CURDATE(), INTERVAL 3 DAY), CURDATE(), 4, 0, 6, 1350.00, 'CHECKED_IN', NOW(), NOW()),
('Jennifer', 'Martinez', 'she/her', DATE_SUB(CURDATE(), INTERVAL 1 DAY), CURDATE(), 2, 0, 10, 150.00, 'CHECKED_IN', NOW(), NOW()),
('Christopher', 'Garcia', 'he/him', DATE_SUB(CURDATE(), INTERVAL 4 DAY), CURDATE(), 2, 2, 4, 1000.00, 'CHECKED_IN', NOW(), NOW());

-- Additional bookings for occupancy rate calculation (this week)
-- Monday check-ins
INSERT IGNORE INTO bookings (first_name, last_name, pronouns, check_in_date, check_out_date, adult_capacity, children_capacity, room_id, total_amount, status, created_at, updated_at) VALUES
('Alex', 'Rodriguez', 'they/them', DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 2 DAY), 2, 0, 9, 900.00, 'CHECKED_OUT', NOW(), NOW()),
('Maria', 'Lopez', 'she/her', DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 3 DAY), 2, 1, 1, 450.00, 'BOOKED', NOW(), NOW());

-- Tuesday check-ins
INSERT IGNORE INTO bookings (first_name, last_name, pronouns, check_in_date, check_out_date, adult_capacity, children_capacity, room_id, total_amount, status, created_at, updated_at) VALUES
('James', 'White', 'he/him', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 1 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 4 DAY), 4, 2, 5, 1800.00, 'BOOKED', NOW(), NOW()),
('Amanda', 'Lee', 'she/her', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 1 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 2 DAY), 2, 0, 3, 250.00, 'BOOKED', NOW(), NOW()),
('Kevin', 'Hall', 'he/him', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 1 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 1 DAY), 1, 0, 7, 150.00, 'CANCELLED', NOW(), NOW());

-- Wednesday check-ins
INSERT IGNORE INTO bookings (first_name, last_name, pronouns, check_in_date, check_out_date, adult_capacity, children_capacity, room_id, total_amount, status, created_at, updated_at) VALUES
('Nicole', 'Young', 'she/her', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 2 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 5 DAY), 2, 2, 8, 750.00, 'CHECKED_IN', NOW(), NOW()),
('Brian', 'King', 'he/him', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 2 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 3 DAY), 2, 0, 2, 150.00, 'BOOKED', NOW(), NOW()),
('Rachel', 'Wright', 'she/her', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 2 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 4 DAY), 1, 1, 10, 300.00, 'CANCELLED', NOW(), NOW()),
('Steven', 'Hill', 'he/him', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 2 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 2 DAY), 2, 0, 4, 250.00, 'CANCELLED', NOW(), NOW());

-- Thursday check-ins
INSERT IGNORE INTO bookings (first_name, last_name, pronouns, check_in_date, check_out_date, adult_capacity, children_capacity, room_id, total_amount, status, created_at, updated_at) VALUES
('Kelly', 'Green', 'she/her', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 3 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 6 DAY), 4, 1, 6, 1350.00, 'BOOKED', NOW(), NOW()),
('Paul', 'Adams', 'he/him', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 3 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 4 DAY), 2, 2, 1, 150.00, 'BOOKED', NOW(), NOW());

-- Friday check-ins
INSERT IGNORE INTO bookings (first_name, last_name, pronouns, check_in_date, check_out_date, adult_capacity, children_capacity, room_id, total_amount, status, created_at, updated_at) VALUES
('Samantha', 'Baker', 'she/her', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 4 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY), 2, 0, 9, 1350.00, 'BOOKED', NOW(), NOW()),
('Daniel', 'Nelson', 'he/him', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 4 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 5 DAY), 2, 1, 3, 250.00, 'BOOKED', NOW(), NOW()),
('Laura', 'Carter', 'she/her', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 4 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 6 DAY), 1, 0, 7, 300.00, 'CANCELLED', NOW(), NOW()),
('Ryan', 'Mitchell', 'he/him', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 4 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 5 DAY), 2, 0, 2, 150.00, 'CANCELLED', NOW(), NOW());

-- Saturday check-ins
INSERT IGNORE INTO bookings (first_name, last_name, pronouns, check_in_date, check_out_date, adult_capacity, children_capacity, room_id, total_amount, status, created_at, updated_at) VALUES
('Michelle', 'Perez', 'she/her', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 5 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 8 DAY), 4, 2, 5, 1800.00, 'BOOKED', NOW(), NOW()),
('Jason', 'Roberts', 'he/him', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 5 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY), 2, 0, 8, 500.00, 'BOOKED', NOW(), NOW()),
('Stephanie', 'Turner', 'she/her', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 5 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 6 DAY), 2, 1, 10, 150.00, 'BOOKED', NOW(), NOW());

-- Sunday check-ins
INSERT IGNORE INTO bookings (first_name, last_name, pronouns, check_in_date, check_out_date, adult_capacity, children_capacity, room_id, total_amount, status, created_at, updated_at) VALUES
('Andrew', 'Phillips', 'he/him', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 6 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 9 DAY), 2, 2, 4, 750.00, 'BOOKED', NOW(), NOW()),
('Jessica', 'Campbell', 'she/her', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 6 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 8 DAY), 4, 0, 6, 900.00, 'CANCELLED', NOW(), NOW()),
('Timothy', 'Parker', 'he/him', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 6 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY), 2, 0, 1, 150.00, 'BOOKED', NOW(), NOW());