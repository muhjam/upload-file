/**
 * @swagger
 *
 * /merchandise/list:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: List all merchandise
 *     tags: [Merchandise]
 *     parameters:
 *      - in: query
 *        name: page
 *        required: false
 *        description: The page of list
 *        example: 1
 *      - in: query
 *        name: length
 *        required: false
 *        description: The length of list
 *        example: 10
 *      - in: query
 *        name: search
 *        required: false
 *        description: search with keyword merchandise id, name, description, price, stock
 *     responses:
 *       200:
 *         description: A list of merchandise
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Internal Server Error
 *
 * /merchandise/detail:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get merchandise detail
 *     tags: [Merchandise]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The ID of the merchandise
 *        example: 1
 *     responses:
 *       200:
 *         description: Merchandise detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Internal Server Error
 *
 * /merchandise/create:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create new merchandise
 *     tags: [Merchandise]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 description: Merchandise name
 *                 type: string
 *                 example: "T-Shirt"
 *               description:
 *                 description: Merchandise description
 *                 type: string
 *                 example: "This is a cool T-Shirt"
 *               price:
 *                 description: Merchandise price
 *                 type: number
 *                 example: 100000
 *               stock:
 *                 description: Merchandise stock
 *                 type: integer
 *                 example: 100
 *               image:
 *                 description: Merchandise image file
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Merchandise successfully created
 *       500:
 *         description: Internal Server Error
 *
 * /merchandise/update/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update merchandise
 *     tags: [Merchandise]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The ID of the merchandise
 *        example: 1
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 description: Merchandise name
 *                 type: string
 *                 example: "T-Shirt"
 *               description:
 *                 description: Merchandise description
 *                 type: string
 *                 example: "This is a cool T-Shirt"
 *               price:
 *                 description: Merchandise price
 *                 type: number
 *                 example: 100000
 *               stock:
 *                 description: Merchandise stock
 *                 type: integer
 *                 example: 100
 *               image:
 *                 description: Merchandise image file
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Merchandise successfully updated
 *       500:
 *         description: Internal Server Error
 *
 * /merchandise/delete/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete merchandise
 *     tags: [Merchandise]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The ID of the merchandise
 *        example: 1
 *     responses:
 *       200:
 *         description: Merchandise successfully deleted
 *       500:
 *         description: Internal Server Error
 */
