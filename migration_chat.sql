CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" TEXT NOT NULL CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY,
    "ProductVersion" TEXT NOT NULL
);

BEGIN TRANSACTION;

CREATE TABLE "Orders" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Orders" PRIMARY KEY AUTOINCREMENT,
    "UserId" INTEGER NOT NULL,
    "OrderDate" TEXT NOT NULL,
    "TotalAmount" TEXT NOT NULL,
    "Status" TEXT NOT NULL,
    "ShippingAddress" TEXT NULL,
    "PaymentMethod" TEXT NULL,
    "PaymentTransactionId" TEXT NULL,
    "CardLastFour" TEXT NULL,
    "PhoneNumber" TEXT NULL,
    "PayPalEmail" TEXT NULL,
    "DeliveryInstructions" TEXT NULL,
    "IsPaymentConfirmed" INTEGER NOT NULL,
    "PaymentConfirmedAt" TEXT NULL
);

CREATE TABLE "Products" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Products" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Price" TEXT NOT NULL,
    "CostPrice" TEXT NOT NULL,
    "StockQuantity" INTEGER NOT NULL,
    "VendorId" INTEGER NOT NULL,
    "ImageUrl" TEXT NULL,
    "CreatedAt" TEXT NOT NULL,
    "IsActive" INTEGER NOT NULL
);

CREATE TABLE "StoreSettings" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_StoreSettings" PRIMARY KEY AUTOINCREMENT,
    "StoreName" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "Location" TEXT NOT NULL,
    "OwnersJson" TEXT NOT NULL,
    "MobileNumbersJson" TEXT NOT NULL,
    "EmailsJson" TEXT NOT NULL,
    "Landline" TEXT NOT NULL,
    "WhatsApp" TEXT NOT NULL
);

CREATE TABLE "Users" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Users" PRIMARY KEY AUTOINCREMENT,
    "Username" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "Role" TEXT NOT NULL,
    "CreatedAt" TEXT NOT NULL
);

CREATE TABLE "OrderItems" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_OrderItems" PRIMARY KEY AUTOINCREMENT,
    "OrderId" INTEGER NOT NULL,
    "ProductId" INTEGER NOT NULL,
    "ProductName" TEXT NOT NULL,
    "UnitPrice" TEXT NOT NULL,
    "Quantity" INTEGER NOT NULL,
    CONSTRAINT "FK_OrderItems_Orders_OrderId" FOREIGN KEY ("OrderId") REFERENCES "Orders" ("Id") ON DELETE CASCADE
);

CREATE TABLE "CartItems" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_CartItems" PRIMARY KEY AUTOINCREMENT,
    "UserId" INTEGER NOT NULL,
    "ProductId" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "AddedAt" TEXT NOT NULL,
    CONSTRAINT "FK_CartItems_Products_ProductId" FOREIGN KEY ("ProductId") REFERENCES "Products" ("Id") ON DELETE RESTRICT
);

CREATE INDEX "IX_CartItems_ProductId" ON "CartItems" ("ProductId");

CREATE INDEX "IX_CartItems_UserId" ON "CartItems" ("UserId");

CREATE INDEX "IX_OrderItems_OrderId" ON "OrderItems" ("OrderId");

CREATE INDEX "IX_Orders_UserId" ON "Orders" ("UserId");

CREATE INDEX "IX_Products_IsActive" ON "Products" ("IsActive");

CREATE INDEX "IX_Products_VendorId" ON "Products" ("VendorId");

CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260720092925_InitialCreate', '8.0.0');

COMMIT;

BEGIN TRANSACTION;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260722142359_FixUserIdentity', '8.0.0');

COMMIT;

BEGIN TRANSACTION;

ALTER TABLE "Products" ADD "Rating" REAL NULL;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260723183027_AddRatingToProducts', '8.0.0');

COMMIT;

BEGIN TRANSACTION;

ALTER TABLE "Orders" ADD "DeliveredAt" TEXT NULL;

ALTER TABLE "Orders" ADD "ShippedAt" TEXT NULL;

ALTER TABLE "Orders" ADD "ShippingCarrier" TEXT NULL;

ALTER TABLE "Orders" ADD "TrackingNumber" TEXT NULL;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260728061230_AddShipmentTrackingFields', '8.0.0');

COMMIT;

BEGIN TRANSACTION;

CREATE TABLE "WishlistItems" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_WishlistItems" PRIMARY KEY AUTOINCREMENT,
    "UserId" INTEGER NOT NULL,
    "ProductId" INTEGER NOT NULL,
    CONSTRAINT "FK_WishlistItems_Products_ProductId" FOREIGN KEY ("ProductId") REFERENCES "Products" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_WishlistItems_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_WishlistItems_ProductId" ON "WishlistItems" ("ProductId");

CREATE UNIQUE INDEX "IX_WishlistItems_UserId_ProductId" ON "WishlistItems" ("UserId", "ProductId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260728101049_AddWishlist', '8.0.0');

COMMIT;

BEGIN TRANSACTION;

CREATE TABLE "NewsletterSubscriptions" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_NewsletterSubscriptions" PRIMARY KEY AUTOINCREMENT,
    "Email" TEXT NOT NULL,
    "SubscribedAt" TEXT NOT NULL,
    "IsActive" INTEGER NOT NULL
);

CREATE UNIQUE INDEX "IX_NewsletterSubscriptions_Email" ON "NewsletterSubscriptions" ("Email");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260728133922_AddNewsletterSubscriptions', '8.0.0');

COMMIT;

BEGIN TRANSACTION;

ALTER TABLE "Orders" ADD "CurrentStatus" TEXT NOT NULL DEFAULT '';

CREATE TABLE "ShipmentStatusLogs" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_ShipmentStatusLogs" PRIMARY KEY AUTOINCREMENT,
    "OrderId" INTEGER NOT NULL,
    "Status" TEXT NOT NULL,
    "Note" TEXT NULL,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedByUserId" INTEGER NOT NULL,
    CONSTRAINT "FK_ShipmentStatusLogs_Orders_OrderId" FOREIGN KEY ("OrderId") REFERENCES "Orders" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_ShipmentStatusLogs_Users_UpdatedByUserId" FOREIGN KEY ("UpdatedByUserId") REFERENCES "Users" ("Id") ON DELETE RESTRICT
);

CREATE INDEX "IX_ShipmentStatusLogs_OrderId" ON "ShipmentStatusLogs" ("OrderId");

CREATE INDEX "IX_ShipmentStatusLogs_UpdatedByUserId" ON "ShipmentStatusLogs" ("UpdatedByUserId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260729070534_AddShipmentStatusLog', '8.0.0');

COMMIT;

BEGIN TRANSACTION;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260729071224_AddShipmentTrackingSystem', '8.0.0');

COMMIT;

BEGIN TRANSACTION;

CREATE TABLE "Conversations" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Conversations" PRIMARY KEY AUTOINCREMENT,
    "UserId1" INTEGER NOT NULL,
    "UserId2" INTEGER NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "LastMessageAt" TEXT NULL,
    CONSTRAINT "FK_Conversations_Users_UserId1" FOREIGN KEY ("UserId1") REFERENCES "Users" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Conversations_Users_UserId2" FOREIGN KEY ("UserId2") REFERENCES "Users" ("Id") ON DELETE RESTRICT
);

CREATE TABLE "Messages" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Messages" PRIMARY KEY AUTOINCREMENT,
    "ConversationId" INTEGER NOT NULL,
    "SenderId" INTEGER NOT NULL,
    "Content" TEXT NOT NULL,
    "SentAt" TEXT NOT NULL,
    "IsRead" INTEGER NOT NULL,
    CONSTRAINT "FK_Messages_Conversations_ConversationId" FOREIGN KEY ("ConversationId") REFERENCES "Conversations" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Messages_Users_SenderId" FOREIGN KEY ("SenderId") REFERENCES "Users" ("Id") ON DELETE RESTRICT
);

CREATE UNIQUE INDEX "IX_Conversations_UserId1_UserId2" ON "Conversations" ("UserId1", "UserId2");

CREATE INDEX "IX_Conversations_UserId2" ON "Conversations" ("UserId2");

CREATE INDEX "IX_Messages_ConversationId" ON "Messages" ("ConversationId");

CREATE INDEX "IX_Messages_SenderId" ON "Messages" ("SenderId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260729093727_AddChatSystem', '8.0.0');

COMMIT;

